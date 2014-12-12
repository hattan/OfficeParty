var mongoose = require('mongoose');
var messageSchema = mongoose.Schema({
    body: String,
    author: String
})
var Message = mongoose.model('Message', messageSchema);

module.exports = Message;