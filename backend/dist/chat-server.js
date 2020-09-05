"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServer = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = __importDefault(require("socket.io"));
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
    listen() {
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });
        this.io.on("connection", (socket) => {
            let con = this.connections.push({
                id: socket.id,
                rooms: [socket.id],
            });
            con -= 1; // Con misteriously starts at 1
            socket.on("update name", (name) => {
                this.connections[con].name = name;
                console.log(this.connections[con]);
            });
            socket.on("message", (data) => {
                this.io.emit("new message", data);
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
