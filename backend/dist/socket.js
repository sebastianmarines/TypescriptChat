"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const crypto_1 = require("crypto");
//import DB from "./db";
class SocketServer extends socket_io_1.default {
    //private db = new DB();
    constructor(srv, opts) {
        super(srv, opts);
        this.connections = {}; // Store all connected clients
        this.start = () => {
            this.on("connect", (socket) => {
                let id = socket.id;
                this.connections[id] = {
                    name: "",
                    rooms: [],
                };
                // Listeners
                socket.on("login", (name, room) => this.onUpdateName(socket, id, name, room));
                socket.on("message", (data) => this.onMessage(id, data));
                socket.on("disconnect", () => this.onDisconnect(id));
            });
        };
        /*
          Handlers
        */
        this.onUpdateName = (socket, id, name, room) => {
            this.connections[id].name = name;
            this.connections[id].rooms = [...this.connections[id].rooms, room];
            socket.join(room);
            this.to(room).emit("new connection", name);
            //this.db.storeClient(id, name);
        };
        this.onMessage = (id, data) => {
            let date = new Date();
            let minutes = date.getMinutes().toString();
            // Prepend minutes with 0 if it is less than 10
            let timestamp = `${date.getHours()}:${minutes.length < 2 ? "0" : ""}${minutes}`;
            let message = {
                content: data,
                sender: this.connections[id].name,
                timestamp: timestamp,
                id: this.makeHash(id),
            };
            this.sendMessage(id, message);
        };
        this.onDisconnect = (id) => {
            this.emit("someone disconnected", this.connections[id].name);
            delete this.connections[id];
            //this.db.removeClient(id);
        };
        /*
          Utility functions
        */
        this.sendMessage = (id, message) => {
            this.to(this.connections[id].rooms[0]).emit("new message", message);
        };
    }
    makeHash(connection_id) {
        /*
          Create unique hash for message key
        */
        let stamp = Date.now().toString() + this.connections[connection_id].name;
        let hash = crypto_1.createHash("sha1").update(stamp).digest("hex");
        return hash;
    }
}
exports.default = SocketServer;
