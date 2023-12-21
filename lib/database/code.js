const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  pCode: { type: String, default: "undefined" },
});

const code = mongoose.model("code", UserSchema);
module.exports = { code };