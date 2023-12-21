const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  id: { type: String, required: true },
  groupId: { type: String, required: true },
  events: { type: String, default: "false" },
  nsfw: { type: String, default: "true" },
  welcome: { type: String, default: "Привет @user, добро пожаловать в @gname" },
  goodbye: { type: String, default: "@user НН Ливнул" },
  antilink: { type: String, default: "false" }
});

const sck = mongoose.model("sck", GroupSchema);

module.exports = { sck };
