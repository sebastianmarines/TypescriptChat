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
        this.connections = {}; // Store all connected clients
        this.app = express_1.default();
        this.server = http_1.createServer(this.app);
        this.io = socket_io_1.default(this.server);
        this.listen();
    }
    makeHash(connection_id) {
        /*
          Create unique hash for message key
        */
        let stamp = Date.now().toString() + this.connections[connection_id].name;
        let hash = crypto_1.createHash("sha1").update(stamp).digest("hex");
        return hash;
    }
    listen() {
        // Start server
        this.server.listen(this.port, () => {
            console.log("Running server on port %s", this.port);
        });
        // Connection handler
        this.io.on("connection", (socket) => {
            let id = socket.id;
            // Save current connection
            this.connections[id] = {
                name: "",
                rooms: [id],
            };
            // Save the name that will appear in chat
            socket.on("update name", (name) => {
                this.connections[id].name = name;
                this.io.emit("new connection", name);
            });
            socket.on("message", (data) => {
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
