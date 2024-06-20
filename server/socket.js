require('dotenv').config();
const { Server } = require("socket.io");
const Notification = require("./models/Notification");
const User = require("./models/User");
const eventEmitter = require('./Utils/EventEmitter'); // Import the event emitter


module.exports = (s) => {
    const io = new Server(s, {
        cors: {
            origin: process.env.ORIGIN,
        }
    });
    io.on("connection", async (socket) => {

        let MongoId = await new Promise((resolve) => eventEmitter.on("uid", resolve));

        let user = await User.findOneAndUpdate({_id:MongoId},{$set:{SocketId: socket.id}});

        eventEmitter.on("post_added" + socket.id, async (data) => {
            let d = JSON.parse(data);
            let socketData = await User.findOne({_id:d.UserId},{SocketId:1});
            console.log(socketData.SocketId,socket.id);
            io.to(socketData.SocketId).emit("post_added",data);
        });

    })
};