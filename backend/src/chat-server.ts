import express from "express";
import { createServer, Server } from "http";
import socketIo from "socket.io";

import { PORT } from "./config/constants";

export class ChatServer {
  private app: express.Application;
  private port: string | number = PORT;
  private server: Server;
  private io: socketIo.Server;

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
      console.log("new connection");
      socket.emit("add-users", "hello world")
      socket.on("message", (data) => {
          console.log(data)
      })
    });
    
  }

  public getApp(): express.Application {
    return this.app;
  }
}
