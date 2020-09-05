import express from "express";
import { createServer, Server } from "http";
import socketIo from "socket.io";

import { PORT } from "./config/constants";
import { Sender } from "./interfaces";

export class ChatServer {
  private app: express.Application;
  private port: string | number = PORT;
  private server: Server;
  private io: socketIo.Server;

  private connections: Sender[] = [];

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.listen();
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
    this.io.on("connection", (socket: socketIo.Socket) => {
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

  public getApp(): express.Application {
    return this.app;
  }
}
