let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    accesstoken: {
        type: String,
    },
    refreshtoken: {
        type: String,
    },
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
    ]
},
    {
        timestamps: true
    });
const User = mongoose.model('User', userSchema);
module.exports = User;
