var Booking = require("../models/booking");
var User = require("../models/user");
var moment = require("moment");
var ObjectId = require("mongodb").ObjectID;

module.exports = {
  getAllBookings: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user[0].type == "student") {
      data = await Booking.find({ studentID: user[0].studentID });
    } else if (user[0].type == "teacher") {
      data = await Booking.find({ teacher_id: user[0]._id });
    }

    if (data) {
      res.status(200).json({
        data,
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  getAllBookingsCommon: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user[0] && user[0].type == "student") {
      data = await Booking.aggregate([
        { $match: { studentID: user[0].studentID } },
        {
          $lookup: {
            let: { userObjId: { $toObjectId: "$teacher_id" } },
            from: "users",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
              { $project: { _id: 1, name: 1, department: 1, course: 1 } },
            ],

            as: "userDetails",
          },
        },
        {
          $lookup: {
            let: { userObjId: { $toObjectId: "$schedule_id" } },
            from: "schedules",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
              { $project: { _id: 1, day: 1, start_time: 1, end_time: 1 } },
            ],

            as: "scheduleDetails",
          },
        },
      ]);
    } else if (user[0] && user[0].type == "teacher") {
      data = await Booking.aggregate([
        { $match: { teacher_id: user[0]._id.toString() } },
        {
          $lookup: {
            let: { userObjId: { $toObjectId: "$teacher_id" } },
            from: "users",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
              { $project: { _id: 1, name: 1, department: 1, course: 1 } },
            ],

            as: "userDetails",
          },
        },
        {
          $lookup: {
            let: { userObjId: { $toObjectId: "$schedule_id" } },
            from: "schedules",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
              { $project: { _id: 1, day: 1, start_time: 1, end_time: 1 } },
            ],

            as: "scheduleDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentID",
            foreignField: "studentID",
            as: "studentDetails",
          },
        },
      ]);
    } else if (user[0] && user[0].type == "admin") {
      data = await Booking.aggregate([
        {
          $lookup: {
            let: { userObjId: { $toObjectId: "$teacher_id" } },
            from: "users",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
              { $project: { _id: 1, name: 1, department: 1, course: 1 } },
            ],

            as: "userDetails",
          },
        },
        {
          $lookup: {
            let: { userObjId: { $toObjectId: "$schedule_id" } },
            from: "schedules",
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
              { $project: { _id: 1, day: 1, start_time: 1, end_time: 1 } },
            ],

            as: "scheduleDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "studentID",
            foreignField: "studentID",
            as: "studentDetails",
          },
        },
      ]);
    }

    if (data) {
      res.status(200).json({
        data,
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },

  getOneBooking: async (req, res) => {
    let data = await Booking.findOne({ _id: req.params.id });
    if (data) {
      return res.status(200).json({
        data,
      });
    } else {
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  // delete one
  deleteOneBooking(req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    Booking.findOneAndRemove({ _id: req.params.id }, (error, data) => {
      if (error) {
        return res.status(500).json({
          msg: "Internal server error",
        });
      } else {
        return res.status(200).json({
          msg: "Your data has been deleted!",
        });
      }
    });
  },

  // update one
  updateOne: async (req, res) => {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user.length > 0 && user[0].type == "teacher") {
      data = await Booking.updateOne(
        { _id: req.params.id, teacher_id: user[0]._id },
        req.body
      );
    } else if (user.length > 0 && user[0].type == "admin") {
      data = await Booking.updateOne({ _id: req.params.id }, req.body);
    } else {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }

    if (data) {
      return res.status(200).json({
        data,
        msg: "Your data has been updated!",
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },

  async createNewBooking(req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let added = false;
    let token = req.headers.authorization.split("Bearer ")[1];
    let data;

    let hasOne = await Booking.findOne({
      schedule_id: req.body.schedule_id,
      studentID: req.body.studentID,
      teacher_id: req.body.teacher_id,
    });
    if (hasOne) {
      let d1 = moment(hasOne.time).format("YYYY-MM-DD");
      let d2 = moment().format("YYYY-MM-DD");
      if (d1 == d2) {
        added = true;
      } else {
        added = false;
      }
    }
    if (added == false) {
      data = await Booking.create({
        schedule_id: req.body.schedule_id,
        studentID: req.body.studentID,
        teacher_id: req.body.teacher_id,
        appointment: req.body.appointment,
        agenda: req.body.agenda,
        status: req.body.status,
      });
    } else {
      return res.status(401).json({
        msg: "Already applied",
      });
    }

    if (data) {
      return res.status(200).json({
        data,
      });
    } else {
      return res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
};
