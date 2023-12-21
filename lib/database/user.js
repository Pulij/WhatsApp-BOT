const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String },
  bot: { type: Boolean },
  ban: { type: String, default: "false" },
  reason: { type: String, default: "Причина не была указана.." },
}, { versionKey: false });

const sck1 = mongoose.model("Sck1", UserSchema);
module.exports = { sck1 };