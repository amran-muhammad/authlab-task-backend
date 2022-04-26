var express = require('express');
var router = express.Router();
var BookingController = require('../controllers/BookingController');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



//add one
router.post('/add', BookingController.createNewBooking);

//find all
router.get('/api/all', BookingController.getAllBookings);
router.get('/api/common/all', BookingController.getAllBookingsCommon);
//find one
router.get('/requests/:id', BookingController.getOneBooking);
//delete one
router.delete('/requests/:id', BookingController.deleteOneBooking)
//updateOne
router.put('/requests/update/:id', BookingController.updateOne)

module.exports = router;
