let mongoose = require("mongoose");

let commentSchema = mongoose.Schema({});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
