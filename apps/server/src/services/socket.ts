import { Server } from "socket.io";
import { Redis } from "ioredis";
import prismClient from "./prisma";
import { createProducer } from "./kafka";

const pub = new Redis({
    host:'',
    port:,
    username:'default',
    password:''
});
const sub = new Redis({
    host:'',
    port: ,
    username:'',
    password:''

});



class SocketService{
    private _io: Server;

    constructor(){
        console.log("Init Socket Service...");
        this._io = new Server({
            cors:{
                allowedHeaders:["*"],
                origin: "*",
            },
        
            
        }

        );
        sub.subscribe('MESSAGES')
    }
    public initListeners() {
        const io = this.io;
        console.log("Init Socket Listeners...");
    
        io.on("connect", (socket) => {
          console.log(`New Socket Connected`, socket.id);
          socket.on("event:message", async ({ message }: { message: string }) => {
            console.log("New Message Rec.", message);
            await pub.publish("MESSAGES", JSON.stringify({ message }));

            }
                
            );
        });

        sub.on('message', async (channel,message) => {
            if (channel === "MESSAGES") {
                io.emit("message", message);
                await prismClient.message.create({
                    data:{
                        text: message,
                    },
                })
            }
        }
        
        
        
        )
        
    }
    get io(){
        return this._io;
    }


}

export default SocketService;
