let mongoose = require("mongoose");

let FollowSchema = mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    followingId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
{
    timestamps: true
});
const Follow = mongoose.model('Follow', FollowSchema);
module.exports = Follow;
