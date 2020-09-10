"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = __importDefault(require("socket.io"));
const crypto_1 = require("crypto");
const constants_1 = require("./config/constants");
class ChatServer {
    constructor() {
        this.port = constants_1.PORT;
        // private connections: Sender[] = [];
        this.connections = {};
        this.app = express_1.default();
        this.server = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.server);
        this.listen();
    }
    makeHash(connection_id) {
        let stamp = Date.now().toString() + this.connections[connection_id].name;
        let hash = crypto_1.createHash("sha1").update(stamp).digest("hex");
        return hash;
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });
        this.io.on("connection", (socket) => {
            let id = socket.id;
            this.connections[id] = {
                name: "",
                rooms: [id]
            };
            socket.on("update name", (name) => {
                this.connections[id].name = name;
                this.io.emit("new connection", name);
            });
            socket.on("message", (data) => {
                let date = new Date;
                let minutes = date.getMinutes().toString();
                if (minutes.length < 2) {
                    minutes = "0" + minutes;
                }
                let message = {
                    content: data,
                    sender: this.connections[id].name,
                    timestamp: `${date.getHours()}:${minutes}`,
                    id: this.makeHash(id),
                };
                this.io.emit("new message", message);
            });
            socket.on("disconnect", () => {
                this.io.emit("someone disconnected", this.connections[id].name);
                delete this.connections[id];
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ChatServer = ChatServer;
