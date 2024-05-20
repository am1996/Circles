let mongoose = require("mongoose");

let LikeSchema = mongoose.Schema({});
const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
