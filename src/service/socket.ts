import { Redis } from "ioredis";
import { Server } from "socket.io";

const pub = new Redis({
    host: "redis-3fc2f27e-santisingha191-9833.a.aivencloud.com",
    port: 20937,
    username: "default",
    password: "AVNS_JJCy78loqgl-Tmh-2rM"
});
const sub = new Redis({
    host: "redis-3fc2f27e-santisingha191-9833.a.aivencloud.com",
    port: 20937,
    username: "default",
    password: "AVNS_JJCy78loqgl-Tmh-2rM"
});

class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init socket service...");
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
        sub.subscribe("MESSAGES")
    }

    public initListeners() {
        const io = this.io;
        console.log("Init socket listeners...");
        
        io.on("connect", (socket) => {
            console.log(`New socket connected `, socket.id);
            
            socket.on('event:message', async ({message}: {message: string}) => {
                console.log("New message received: ", message);

                //publish this message to redis
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            })
        })

        sub.on("message", async (channel, message) => {
            console.log("message");
            if(channel === "MESSAGES") {
                io.emit("message", message);
            }
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService;