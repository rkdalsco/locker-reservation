const mongoose = require('mongoose');

const lockerSchema = new mongoose.Schema({
  lockerNumber: { type: Number, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  password: { type: String, required: true },
  timestamp: { type: Date, required: true }
});

const Locker = mongoose.model('Locker', lockerSchema);
module.exports = Locker;
