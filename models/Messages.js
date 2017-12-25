const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MsgSchema = new Schema({
  
  body: String

});

const Messages = mongoose.model("Messages", MsgSchema);

module.exports = Messages;