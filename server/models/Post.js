let mongoose = require("mongoose");

let postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        index: true
    }
},
{
    timestamps: true
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
