"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = __importDefault(require("socket.io"));
const crypto_1 = require("crypto");
const db_1 = __importDefault(require("./db"));
class SocketServer extends socket_io_1.default {
    constructor(srv, opts) {
        super(srv, opts);
        this.connections = {}; // Store all connected clients
        this.db = new db_1.default();
        this.start = () => {
            this.on("connect", (socket) => {
                let id = socket.id;
                this.connections[id] = {
                    name: "",
                    rooms: [],
                };
                // Listeners
                socket.on("login", (name, room) => this.onLogin(socket, id, name, room));
                socket.on("message", (data) => this.onMessage(id, data));
                socket.on("disconnect", () => this.onDisconnect(id));
            });
        };
        /*
          Handlers
        */
        this.onLogin = (socket, id, name, room) => {
            this.connections[id].name = name;
            this.connections[id].rooms = [...this.connections[id].rooms, room];
            socket.join(room);
            this.to(room).emit("new connection", name);
            this.db.storeClient(id, this.connections[id]);
            this.sendPastMessages(socket, room);
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
            this.db.addMessage(this.connections[id].rooms[0], message);
        };
        this.onDisconnect = (id) => {
            this.emit("someone disconnected", this.connections[id].name);
            delete this.connections[id];
            this.db.removeClient(id);
        };
        /*
          Utility functions
        */
        this.sendMessage = (id, message) => {
            this.to(this.connections[id].rooms[0]).emit("new message", message);
        };
        this.sendPastMessages = (socket, room) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.getMessages(room, (messages) => {
                socket.emit("past messages", messages);
            });
        });
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
