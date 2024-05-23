let mongoose = require("mongoose");

let commentSchema = mongoose.Schema({
    postId: {
        type: mongoose.Schema.ObjectId,
        ref:'Post'
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: true
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
