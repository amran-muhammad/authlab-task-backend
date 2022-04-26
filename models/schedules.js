const mongoose = require('mongoose');

//Schema
const Schema = mongoose.Schema;
const ScheduleSchema = new Schema({
    day:String,
    start_time: Number,
    end_time: Number,
    status: String,
    teacher_id: String,
    department: String,
    time : { type : Date, default: Date.now }
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);
module.exports = Schedule;