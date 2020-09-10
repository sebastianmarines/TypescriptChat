import express from "express";
import { createServer, Server } from "http";

import SocketServer from './socket'
import { PORT } from "./config/constants";

export class ChatServer {
  private app: express.Application;
  private port: string | number = PORT;
  private server: Server;
  private io: SocketServer;
  
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketServer(this.server)
    this.listen();
  }

  private listen(): void {
    // Start server
    this.server.listen(this.port, () => {
      console.log("Running server on port %s", this.port);
    });

    this.io.start()
    
  }

  public getApp(): express.Application {
    return this.app;
  }
}
