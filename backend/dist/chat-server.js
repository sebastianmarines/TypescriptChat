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
        this.connections = [];
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
            let con = this.connections.push({
                id: socket.id,
                name: "",
                rooms: [socket.id],
            });
            con -= 1; // Con misteriously starts at 1
            socket.on("update name", (name) => {
                this.connections[con].name = name;
                console.log(this.connections[con]);
                this.io.emit("new connection", name);
            });
            socket.on("message", (data) => {
                let message = {
                    content: data.content,
                    sender: this.connections[con].name,
                    sender_id: this.connections[con].id,
                    id: this.makeHash(con),
                };
                this.io.emit("new message", message);
            });
            socket.on("disconnect", () => {
                this.connections.splice(con, 1);
                console.log(`${con} disconnected`);
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ChatServer = ChatServer;
