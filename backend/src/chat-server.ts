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

  private connections: { [id: string]: Sender } = {}; // Store all connected clients

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = socketIo(this.server);
    this.listen();
  }

  private makeHash(connection_id: string): string {
    /*
      Create unique hash for message key
    */
    let stamp = Date.now().toString() + this.connections[connection_id].name;
    let hash = createHash("sha1").update(stamp).digest("hex");
    return hash;
  }

  private listen(): void {
    // Start server
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    // Connection handler
    this.io.on("connection", (socket: socketIo.Socket) => {
      let id = socket.id;

      // Save current connection
      this.connections[id] = {
        name: "",
        rooms: [id],
      };

      // Save the name that will appear in chat
      socket.on("update name", (name: string) => {
        this.connections[id].name = name;
        this.io.emit("new connection", name);
      });

      socket.on("message", (data: string) => {
        let date = new Date();
        let minutes = date.getMinutes().toString();
        // Prepend minutes with 0 if it is less than 10
        let timestamp = `${date.getHours()}:${
          minutes.length < 2 ? "0" : ""
        }${minutes}`;

        let message: OutMessage = {
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

  public getApp(): express.Application {
    return this.app;
  }
}
