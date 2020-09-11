import { createClient, RedisClient, ClientOpts } from "redis";
import { OutMessage, Sender } from "./interfaces";

export default class DB {
  private redis: RedisClient;

  constructor(opts?: ClientOpts) {
    this.redis = createClient(opts);
    this.redis.on("connect", function () {
      console.log("connected to Redis");
    });
  }

  storeClient = (id: string, data: Sender) => {
    this.redis.set(`client:${id}`, JSON.stringify(data), (err, reply) => {
      console.log(reply);
    });
  };

  addMessage = (room: string, message: OutMessage) => {
    this.redis.lpush(`room:${room}`, JSON.stringify(message));
    this.redis.ltrim(`room:${room}`, 0, 15);
  };

  async getMessages(room: string, callback: (messages:OutMessage[]) => void) {
    // TODO check if room exists
    let messages: OutMessage[] = [];
    this.redis.lrange(`room:${room}`, 0, 15, (err, reply) => {
      reply.forEach((message) => {
        messages.push(JSON.parse(message));
      });
      callback(messages)
    });
  }

  removeClient = (id: string) => {
    this.redis.del(`client:${id}`);
  };
}
