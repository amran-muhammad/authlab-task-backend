var Schedule = require("../models/schedules");
var User = require("../models/user");

module.exports = {
  getAllSchedules: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user.length > 0 && user[0].type == "admin") {
      data = await Schedule.aggregate([
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
      ]);
    }
    if (user.length > 0 && user[0].type == "teacher") {
      data = await Schedule.find({ teacher_id: user[0]._id });
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
  getAllSchedulesCommon: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }

    let data = await Schedule.aggregate([
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
    ]);

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
  getAllSchedulesCommonSearchByTeacher: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let teacher = req.body.teacher;

    let data = await Schedule.aggregate([
      { $match: { $expr: { $eq: ["$teacher_id", teacher] } } },
      {
        $lookup: {
          let: { userObjId: { $toObjectId: teacher } },
          from: "users",
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userObjId"] } } },
            { $project: { _id: 1, name: 1, department: 1, course: 1 } },
          ],

          as: "userDetails",
        },
      },
    ]);

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
  getAllSchedulesCommonSearchByDepartment: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let department = req.body.department;

    let data = await Schedule.aggregate([
      { $match: { $expr: { $eq: ["$department", department] } } },
      {
        $lookup: {
          let: { userObjId: { $toObjectId: "$teacher_id" } },
          from: "users",
          pipeline: [
            
            { $project: { _id: 1, name: 1, department: 1, course: 1 } },
          ],

          as: "userDetails",
        },
      },
    ]);

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

  getOneSchedule: async (req, res) => {
    let data = await Schedule.findOne({ _id: req.params.id });
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
  // delete one
  async deleteOneSchedule(req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let added = false;
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user.length > 0 && user[0].type == "admin") {
      data = await Schedule.findOneAndRemove({ _id: req.params.id });
    } else if (user.length > 0 && user[0].type == "teacher") {
      data = await Schedule.findOneAndRemove({
        _id: req.params.id,
        teacher_id: user[0]._id,
      });
    }
    if (data) {
      return res.status(200).json({
        data,
      });
    }
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

    let st = Number(req.body.start_time);
    let et = Number(req.body.end_time);
    let checkMatch = await Schedule.find({
      _id: { $not: { $eq: req.params.id } },
      day: req.body.day,
      teacher_id: user[0].type == "admin" ? req.body.teacher_id : user[0]._id,
    });

    if (checkMatch.length > 0) {
      for (let i = 0; i < checkMatch.length; i++) {
        if (
          st == checkMatch[i].start_time ||
          (st > checkMatch[i].start_time && st < checkMatch[i].end_time) ||
          (et > checkMatch[i].start_time && et < checkMatch[i].end_time) ||
          (st < checkMatch[i].start_time && et > checkMatch[i].end_time) ||
          (st < checkMatch[i].start_time && et == checkMatch[i].end_time) 
        ) {
          added = true;
          break;
        } else {
          added = false;
        }
      }
    } else {
      added = false;
    }

    if (added == false) {
      let data = await Schedule.updateOne(
        { _id: req.params.id },
        {
          day: req.body.day,
          start_time: req.body.start_time,
          end_time: req.body.end_time,
          status: req.body.status,
          department: req.body.department,
          teacher_id:
            user[0].type == "admin" ? req.body.teacher_id : user[0]._id,
        }
      );
      if (data) {
        return res.status(200).json({
          data,
        });
      } else {
        return res.status(500).json({
          msg: "Internal server error",
        });
      }
    } else {
      return res.status(401).json({
        msg: "Already added",
      });
    }
  },

  async createNewSchedule(req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let added = false;
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let st = Number(req.body.start_time);
    let et = Number(req.body.end_time);
    let checkMatch = await Schedule.find({
      day: req.body.day,
      teacher_id: user[0].type == "admin" ? req.body.teacher_id : user[0]._id,
    });

    if (checkMatch.length > 0) {
      for (let i = 0; i < checkMatch.length; i++) {
        if (
          st == checkMatch[i].start_time ||
          (st > checkMatch[i].start_time && st < checkMatch[i].end_time) ||
          (et > checkMatch[i].start_time && et < checkMatch[i].end_time) ||
          (st < checkMatch[i].start_time && et > checkMatch[i].end_time) ||
          (st < checkMatch[i].start_time && et == checkMatch[i].end_time)
        ) {
          added = true;
          break;
        } else {
          added = false;
        }
      }
    } else {
      added = false;
    }

    if (added == false) {
      let data = await Schedule.create({
        day: req.body.day,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        status: req.body.status,
        department:
          user[0].type == "admin" ? req.body.department : user[0].department,
        teacher_id: user[0].type == "admin" ? req.body.teacher_id : user[0]._id,
      });
      if (data) {
        return res.status(200).json({
          data,
        });
      } else {
        return res.status(500).json({
          msg: "Internal server error",
        });
      }
    } else {
      return res.status(401).json({
        msg: "Already added",
      });
    }
  },
};
