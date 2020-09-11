import SocketIo from "socket.io";
import { Server } from "http";
import { createHash } from "crypto";

import { Sender, OutMessage } from "./interfaces";
import DB from "./db";

export default class SocketServer extends SocketIo {
  private connections: { [id: string]: Sender } = {}; // Store all connected clients
  private db = new DB();

  constructor(srv: Server, opts?: SocketIo.ServerOptions) {
    super(srv, opts);
  }

  start = () => {
    this.on("connect", (socket: SocketIo.Socket) => {
      let id = socket.id;
      this.connections[id] = {
        name: "",
        rooms: [],
      };

      // Listeners
      socket.on("login", (name, room) => this.onLogin(socket, id, name, room));
      socket.on("message", (data) => this.onMessage(id, data));
      socket.on("disconnect", () => this.onDisconnect(id));
    });
  };

  /*
    Handlers
  */
  onLogin = (
    socket: SocketIo.Socket,
    id: string,
    name: string,
    room: string
  ) => {
    this.connections[id].name = name;
    this.connections[id].rooms = [...this.connections[id].rooms, room];
    socket.join(room);
    this.to(room).emit("new connection", name);
    this.db.storeClient(id, this.connections[id]);
    this.sendPastMessages(socket, room);
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
    this.sendMessage(id, message);
    this.db.addMessage(this.connections[id].rooms[0], message);
  };

  onDisconnect = (id: string) => {
    this.emit("someone disconnected", this.connections[id].name);
    delete this.connections[id];
    this.db.removeClient(id);
  };

  /*
    Utility functions
  */
  sendMessage = (id: string, message: OutMessage) => {
    this.to(this.connections[id].rooms[0]).emit("new message", message);
  };

  sendPastMessages = async (socket: SocketIo.Socket, room: string) => {
    await this.db.getMessages(room, (messages) => {
      socket.emit("past messages", messages);
    });
    
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
