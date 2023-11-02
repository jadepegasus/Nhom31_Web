const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    to_user_id: String,
    from_user_id: String,
    action: String, // loại thông báo: kết bạn, có người follow, ...
    url: String, // link dẫn đến nguồn thông báo
    time: {
        type: Date,
        default: Date.now
    },
    seen: String  // đã xem hoặc chưa xem
})

module.exports = mongoose.module("notification", notificationSchema);