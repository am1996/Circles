let mongoose = require("mongoose");

let postSchema = mongoose.Schema({});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
