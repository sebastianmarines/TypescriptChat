"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class DB {
    constructor(opts) {
        this.storeClient = (id, data) => {
            this.redis.set(`client:${id}`, JSON.stringify(data), (err, reply) => {
                console.log(reply);
            });
        };
        this.addMessage = (room, message) => {
            this.redis.lpush(`room:${room}`, JSON.stringify(message));
            this.redis.ltrim(`room:${room}`, 0, 15);
        };
        this.removeClient = (id) => {
            this.redis.del(`client:${id}`);
        };
        this.redis = redis_1.createClient(opts);
        this.redis.on("connect", function () {
            console.log("connected to Redis");
        });
    }
    getMessages(room, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO check if room exists
            let messages = [];
            this.redis.lrange(`room:${room}`, 0, 15, (err, reply) => {
                reply.forEach((message) => {
                    messages.push(JSON.parse(message));
                });
                callback(messages);
            });
        });
    }
}
exports.default = DB;
