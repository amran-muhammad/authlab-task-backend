const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;
const BookingSchema = new Schema({
  schedule_id: String,
  studentID: String,
  teacher_id: String,
  status: String,
  agenda: String,
  appointment: String,
  time: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
