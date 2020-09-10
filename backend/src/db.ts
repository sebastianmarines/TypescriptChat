import { createClient, RedisClient, ClientOpts } from "redis";

export default class DB {
  private redis: RedisClient;

  constructor(opts?: ClientOpts) {
    this.redis = createClient(opts);
    this.redis.on("connect", function () {
      console.log("connected to Redis");
    });
  }

  storeClient = (id: string, name: string) => {
    this.redis.set(`client:${id}`, name, (err, reply) => {
      console.log(reply);
    });
  };

  removeClient = (id: string) => {
    this.redis.del(`client:${id}`);
  };
}
