import express from "express";
import { createServer, Server } from "http";
import socketIo from "socket.io";
import { createHash } from "crypto";

import { PORT } from "./config/constants";
import { Sender, OutMessage, IncomingMessage } from "./interfaces";

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

  private makeHash(connection_id: number): string {
    let stamp = Date.now().toString() + this.connections[connection_id].name;
    let hash = createHash("sha1").update(stamp).digest("hex");
    return hash;
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });
    this.io.on("connection", (socket: socketIo.Socket) => {
      let con = this.connections.push({
        id: socket.id,
        name: "",
        rooms: [socket.id],
      });
      con -= 1; // Con misteriously starts at 1
      socket.on("update name", (name: string) => {
        this.connections[con].name = name;
        console.log(this.connections[con]);
        this.io.emit("new connection", name)
      });
      socket.on("message", (data: IncomingMessage) => {
        let message: OutMessage = {
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

  public getApp(): express.Application {
    return this.app;
  }
}
