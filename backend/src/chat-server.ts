import express from "express";
import { createServer, Server } from "http";
import socketIo from "socket.io";
import { createHash } from "crypto";

import { PORT } from "./config/constants";
import { Sender, OutMessage } from "./interfaces";

export class ChatServer {
  private app: express.Application;
  private port: string | number = PORT;
  private server: Server;
  private io: socketIo.Server;

  // private connections: Sender[] = [];
  private connections: {[id: string]: Sender} = {};

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.listen();
  }

  private makeHash(connection_id: string): string {
    let stamp = Date.now().toString() + this.connections[connection_id].name;
    let hash = createHash("sha1").update(stamp).digest("hex");
    return hash;
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
    this.io.on("connection", (socket: socketIo.Socket) => {
      let id = socket.id

      this.connections[id] = {
        name: "",
        rooms: [id]
      }

      socket.on("update name", (name: string) => {
        this.connections[id].name = name;
        this.io.emit("new connection", name)
      });
      socket.on("message", (data: string) => {
        let date = new Date
        let minutes = date.getMinutes().toString()
        if (minutes.length<2) {
          minutes = "0" + minutes
        }

        let message: OutMessage = {
          content: data,
          sender: this.connections[id].name,
          timestamp: `${date.getHours()}:${minutes}`,
          id: this.makeHash(id),
        };
        this.io.emit("new message", message);
      });
      socket.on("disconnect", () => {
        this.io.emit("someone disconnected", this.connections[id].name)
        delete this.connections[id]
      });
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}
