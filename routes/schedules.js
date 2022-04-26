var express = require("express");
var router = express.Router();
var ScheduleController = require("../controllers/ScheduleController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//add one
router.post("/add", ScheduleController.createNewSchedule);

//find all
router.get("/api/all", ScheduleController.getAllSchedules);
router.get("/api/common/all", ScheduleController.getAllSchedulesCommon);
router.post(
  "/api/common/all/search/teacher",
  ScheduleController.getAllSchedulesCommonSearchByTeacher
);
router.post(
  "/api/common/all/search/department",
  ScheduleController.getAllSchedulesCommonSearchByDepartment
);
//find one
router.get("/requests/:id", ScheduleController.getOneSchedule);
//delete one
router.delete("/requests/:id", ScheduleController.deleteOneSchedule);
//updateOne
router.put("/requests/update/:id", ScheduleController.updateOne);

module.exports = router;
