require('dotenv').config();
const { Server } = require("socket.io");
const Notification = require("./models/Notification");
const SocketProfile = require("./models/SocketProfile");
const eventEmitter = require('./Utils/EventEmitter'); // Import the event emitter


module.exports = (s) => {
    const io = new Server(s, {
        cors: {
            origin: process.env.ORIGIN,
        }
    });
    io.on("connection", async (socket)=>{

        let MongoId = await new Promise((resolve) => eventEmitter.on("uid",resolve));
        SocketProfile.create({ 
            SocketId: socket.id,
            MongoId 
        });
        let notifications = await Notification.find({UserId: MongoId},
            { PostId:1,_id:0 }).populate("PostId","title createdAt");
        socket.emit("notifications",JSON.stringify(notifications));

        eventEmitter.on("post_added",async (data)=>{
            let d = JSON.parse(data);
            console.log(d.UserId,d.PostId);
            let notificaiton = await Notification.create({
                UserId: d.UserId,
                PostId: d.PostId
            });
            socket.emit("post_added",data);
        });

        socket.on("disconnect",async ()=>{
            await SocketProfile.findOneAndDelete({SocketId:socket.id});
        });
    })
};