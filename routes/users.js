var express = require('express');
var router = express.Router();
var UserController = require('../controllers/UserController');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
router.post('/add', UserController.createNewUser);
router.post('/get-token', UserController.getToken);
router.get('/get-user-by-token', UserController.getUserByToken);
router.get('/admin/get-all-teacher', UserController.getAllTeacher);
router.get('/admin/get-all-student', UserController.getAllStudent);
router.put('/requests/update/student/:id', UserController.updateOneStudent)
router.put('/requests/update/teacher/:id', UserController.updateOneTeacher)
router.put('/requests/update/:id', UserController.updateOne)

module.exports = router;
