let mongoose = require("mongoose");

let SocketProfileSchema = mongoose.Schema({
    SocketId: String,
    MongoId: String
},
{
    timestamps: true
});

SocketProfileSchema.index({createdAt: 1},{expires: 86400});
const SocketProfile = mongoose.model('SocketProfile', SocketProfileSchema);
module.exports = SocketProfile;
