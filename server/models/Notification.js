let mongoose = require("mongoose");

let NotificationSchema = mongoose.Schema({
    read: { type: Boolean, default: false },
    UserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    PostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
},
{
    timestamps: true
});

NotificationSchema.index({createdAt: 1},{expires: 345600});
const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
