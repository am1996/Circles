let mongoose = require("mongoose");

let FollowSchema = mongoose.Schema({});
const Follow = mongoose.model('Follow', FollowSchema);
module.exports = Follow;
