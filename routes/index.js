var express = require('express');
var router = express.Router();
var AdminController = require('../controllers/AdminController');



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



//add one
router.get('/requests', AdminController.createNewBlog);

//find all DATE FILTER
router.get('/requests/between', AdminController.filterByDate);
//filter by age
router.get('/requests/between/age', AdminController.filterByAge);
//find all
router.get('/api/requests', AdminController.getAllBlogs);
//find one
router.get('/requests/:id', AdminController.getOneBlog);
//edit
router.put('/requests/:id', AdminController.editOneBlog);
//delete one
router.delete('/requests/:id', AdminController.deleteOneBlog)
//updateOne
router.patch('/requests/update/:id', AdminController.updateOne)
//find one among multi same entries
router.get('/requests/people/search', AdminController.searchByName)




module.exports = router;
