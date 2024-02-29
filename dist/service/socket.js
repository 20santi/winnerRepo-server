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
const ioredis_1 = require("ioredis");
const socket_io_1 = require("socket.io");
const pub = new ioredis_1.Redis({
    host: "redis-3fc2f27e-santisingha191-9833.a.aivencloud.com",
    port: 20937,
    username: "default",
    password: "AVNS_JJCy78loqgl-Tmh-2rM"
});
const sub = new ioredis_1.Redis({
    host: "redis-3fc2f27e-santisingha191-9833.a.aivencloud.com",
    port: 20937,
    username: "default",
    password: "AVNS_JJCy78loqgl-Tmh-2rM"
});
class SocketService {
    constructor() {
        console.log("Init socket service...");
        this._io = new socket_io_1.Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
        sub.subscribe("MESSAGES");
    }
    initListeners() {
        const io = this.io;
        console.log("Init socket listeners...");
        io.on("connect", (socket) => {
            console.log(`New socket connected `, socket.id);
            socket.on('event:message', ({ message }) => __awaiter(this, void 0, void 0, function* () {
                console.log("New message received: ", message);
                //publish this message to redis
                yield pub.publish("MESSAGES", JSON.stringify({ message }));
            }));
        });
        sub.on("message", (channel, message) => __awaiter(this, void 0, void 0, function* () {
            console.log("message");
            if (channel === "MESSAGES") {
                io.emit("message", message);
            }
        }));
    }
    get io() {
        return this._io;
    }
}
exports.default = SocketService;
