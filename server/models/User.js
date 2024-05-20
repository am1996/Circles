let mongoose = require("mongoose");

let userSchema = mongoose.Schema({});
const User = mongoose.model('User', userSchema);
module.exports = User;
