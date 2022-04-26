var User = require("../models/user");
function generateToken(n) {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

module.exports = {
  getAllUsers: async function (req, res) {
    // let data = await User.find({ designation: /Software/ })
    let data = await User.find();
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

  getOneUser: async (req, res) => {
    let data = await User.findOne({ _id: req.params.id });
    if (data) {
      res.status(200).json({
        Users: data,
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  // edit one User
  editOneUser(req, res) {
    User.findOne({ _id: req.params.id }, (error, data) => {
      if (error) {
        res.status(500).json({
          msg: "Internal server error",
        });
      } else {
        if (!data) {
          res.status(401).send("Please insert data");
        }
        if (req.body.name) {
          data.name = req.body.name;
        }
        if (req.body.designation) {
          data.designation = req.body.designation;
        }
        data.save((error, updatedData) => {
          if (error) {
            res.status(500).json({
              msg: "Internal server error",
            });
          } else {
            res.send("Your data has been updated!");
          }
        });
      }
    });
  },
  // delete one
  deleteOneUser(req, res) {
    User.findOneAndRemove({ _id: req.params.id }, (error, data) => {
      if (error) {
        res.status(500).json({
          msg: "Internal server error",
        });
      } else {
        res.send("Your data has been deleted!");
      }
    });
  },

  // update one
  updateOneStudent: async (req, res) => {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user.length > 0 && user[0].type == "admin") {
      data = await User.updateOne({ _id: req.params.id }, req.body);
    } else {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }

    if (data) {
      return res.status(200).json({
        msg: "Updated user",
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  // update one
  updateOneTeacher: async (req, res) => {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user.length > 0 && user[0].type == "admin") {
      data = await User.updateOne({ _id: req.params.id }, req.body);
    } else {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }

    if (data) {
      return res.status(200).json({
        msg: "Updated user",
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
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
    let data;
    if (user.length > 0 && user[0].type == "admin") {
      data = await User.updateOne({ _id: req.params.id }, req.body);
    } else if (user.length > 0 && user[0]._id == req.params.id) {
      data = await User.updateOne({ _id: req.params.id }, req.body);
    } else {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }

    if (data) {
      return res.status(200).json({
        msg: "Updated user",
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  // search by name
  searchByName: async (req, res) => {
    // var data = await User.find({ name: req.params.name })
    // var data = await User.countDocuments({name: req.query.name})
    var data = await User.aggregate([
      {
        $group: {
          _id: null,
          average_age: { $avg: "$age" },
        },
      },
    ]);
    if (data) {
      //  console.log(data)
      return res.status(200).json({
        data,
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },

  // filtere by age
  filterByAge: async (req, res) => {
    var inputDate1 = req.body.from;
    var inputDate2 = req.body.to;
    var data = await User.find({
      age: {
        $gte: inputDate1,
        $lt: inputDate2,
      },
    }).lean();

    if (data) {
      res.status(200).json({
        Users: data,
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },
  //find all DATE FILTER
  filterByDate: async (req, res) => {
    var inputDate1 = new Date(req.body.from).toISOString();
    var inputDate2 = new Date(req.body.to).toISOString();
    var data = await User.find({
      dob: {
        $gte: inputDate1,
        $lt: inputDate2,
      },
    });

    if (data) {
      res.status(200).json({
        users: data,
      });
    } else {
      res.status(500).json({
        msg: "Internal server error",
      });
    }
  },

  createNewUser(req, res) {
    let newUser = new User();
    let token = generateToken(256);
    gtoken = [];
    gtoken.push(token);
    (newUser.name = req.body.name), (newUser.email = req.body.email);
    newUser.department = req.body.department;
    newUser.studentID = req.body.studentID;
    newUser.type = req.body.type;
    newUser.course = req.body.course;
    newUser.status = req.body.status;
    (newUser.token = gtoken), (newUser.password = req.body.password);
    // Call setPassword function to hash password
    newUser.setPassword(req.body.password);
    // Save newUser object to database
    newUser.save((err, User) => {
      if (err) {
        return res.status(400).send({
          message: "Failed to add user.",
        });
      } else {
        return res.status(200).send({
          user: User,
          message: "User added successfully.",
        });
      }
    });
  },
  getToken(req, res) {
    // Find user with requested email

    User.findOne({ email: req.body.email }, function (err, user) {
      if (user === null) {
        return res.status(400).json({
          message: "User not found.",
        });
      } else {
        if (
          user.validPassword(req.body.password) &&
          user.status == "Approved"
        ) {
          return res.status(200).json({
            token: user.token[user.token.length - 1],
            message: "User Logged In",
          });
        } else {
          return res.status(401).json({
            message: "Wrong Password",
          });
        }
      }
    });
  },
  async getUserByToken(req, res) {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    res.status(200).json({
      user: user[0],
    });
  },
  async getAllTeacher(req, res) {
    if (!req.headers.authorization) {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;

    data = await User.find({ type: "teacher" }).select("-token -salt -hash");
    return res.status(200).json({
      data,
    });
  },
  async getAllStudent(req, res) {
    let token = req.headers.authorization.split("Bearer ")[1];
    let user = await User.find({ token }).select("-token -salt -hash");
    let data;
    if (user.length > 0 && user[0].type == "admin") {
      data = await User.find({ type: "student" }).select("-token -salt -hash");
      return res.status(200).json({
        data,
      });
    } else {
      return res.status(500).json({
        msg: "Unauthorized user",
      });
    }
  },
};
