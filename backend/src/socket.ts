import SocketIo from "socket.io";
import { Server } from "http";
import { createHash } from "crypto";

import { Sender, OutMessage } from "./interfaces";

export default class SocketServer extends SocketIo {
  private connections: { [id: string]: Sender } = {}; // Store all connected clients

  constructor(srv: Server, opts?: SocketIo.ServerOptions) {
    super(srv, opts);
  }

  start = () => {
    this.on("connect", (socket: SocketIo.Socket) => {
      let id = socket.id;
      this.connections[id] = {
        name: "",
        rooms: [id],
      };

      // Listeners
      socket.on("update name", (name) => this.onUpdateName(id, name))
      socket.on("message", (data) => this.onMessage(id, data));
      socket.on("disconnect", () => this.onDisconnect(id))
    });
  };

  /*
    Handlers
  */
  onUpdateName = (id: string, name: string) => {
    this.connections[id].name = name;
    this.emit("new connection", name);
  };

  onMessage = (id: string, data: string) => {
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
    this.sendMessage(message);
  };

  onDisconnect = (id: string) => {
    this.emit("someone disconnected", this.connections[id].name);
    delete this.connections[id];
  };

  /*
    Utility functions
  */
  sendMessage = (message: OutMessage) => {
    this.emit("new message", message);
  };

  private makeHash(connection_id: string): string {
    /*
      Create unique hash for message key
    */
    let stamp = Date.now().toString() + this.connections[connection_id].name;
    let hash = createHash("sha1").update(stamp).digest("hex");
    return hash;
  }
}
