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
            console.log("new connection");
            socket.emit("add-users", "hello world");
            socket.on("message", (data) => {
                console.log(data);
            });
        });
    }
    getApp() {
        return this.app;
    }
}
exports.ChatServer = ChatServer;
