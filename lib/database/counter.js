const mongoose = require('mongoose');

const groupMessageCounterSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  groupId: {
    type: String,
    required: true,
  },
  msg: {
    type: Number,
    default: 0,
  },
  wbc: {
    type: Number, 
    default: 0
  },
  dailyMsg: {
    type: Number,
    default: 0,
  },
});

const counter = mongoose.model('counter', groupMessageCounterSchema);

module.exports = { counter };
