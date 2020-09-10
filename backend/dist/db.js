"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class DB {
    constructor(opts) {
        this.storeClient = (id, name) => {
            this.redis.set(`client:${id}`, name, (err, reply) => {
                console.log(reply);
            });
        };
        this.removeClient = (id) => {
            this.redis.del(`client:${id}`);
        };
        this.redis = redis_1.createClient(opts);
        this.redis.on("connect", function () {
            console.log("connected to Redis");
        });
    }
}
exports.default = DB;
