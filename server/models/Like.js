let mongoose = require("mongoose");

let LikeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    liked: { type: Boolean} 
},
{
    timestamps: true
});
const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
