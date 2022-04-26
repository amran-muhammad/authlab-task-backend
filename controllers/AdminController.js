var Blog = require('../models/blog');

module.exports = {

    getAllBlogs: async function (req, res) {
        // let data = await Blog.find({ designation: /Software/ })
        let data = await Blog.find();
        if (data) {
            res.status(200).json({
                data
            });
        }
        else {
            res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    getOneBlog: async (req, res) => {
        let data = await Blog.findOne({ _id: req.params.id });
        if (data) {
            res.status(200).json({
                blogs: data
            });
        }
        else {
            res.status(500).json({
                msg: "Internal server error"
            });
        }

    },
    // edit one blog
    editOneBlog(req, res) {
        Blog.findOne({ _id: req.params.id }, (error, data) => {
            if (error) {
                res.status(500).json({
                    msg: "Internal server error"
                })
            } else {
                if (!data) {
                    res.status(401).send('Please insert data')
                }
                if (req.body.name) {
                    data.name = req.body.name
                }
                if (req.body.designation) {
                    data.designation = req.body.designation
                }
                data.save((error, updatedData) => {
                    if (error) {
                        res.status(500).json({
                            msg: "Internal server error"
                        })
                    } else {
                        res.send("Your data has been updated!")
                    }
                });
            }
        })
    },
    // delete one 
    deleteOneBlog(req, res) {
        Blog.findOneAndRemove({ _id: req.params.id }, (error, data) => {
            if (error) {
                res.status(500).json({
                    msg: "Internal server error"
                })
            }
            else {
                res.send("Your data has been deleted!")
            }
        })
    },

    // update one
    updateOne: async (req, res) => {
        var data = await Blog.updateOne({ _id: req.params.id }, req.body)
        if (data) {
            res.send("Your data has been updated!")
        } else {
            res.status(500).json({
                msg: "Internal server error"
            })
        }
    },
    // search by name
    searchByName: async (req, res) => {
        // var data = await Blog.find({ name: req.params.name })
        // var data = await Blog.countDocuments({name: req.query.name})
        var data = await Blog.aggregate([
            {
              $group:
                {
                  _id: null,
                  average_age: { $avg: "$age" }
                }
            }
          ])
        if (data) {
            return res.status(200).json({
                data
            })
        }
        else {
            res.status(500).json({
                msg: "Internal server error"
            })
        }
    },

    // filtere by age
    filterByAge: async (req, res) => {
        var inputDate1 = req.body.from;
        var inputDate2 = req.body.to;
        var data = await Blog.find({
            age: {
                $gte: inputDate1,
                $lt: inputDate2
            }
        }).lean();

        if (data) {
            res.status(200).json({
                blogs: data
            });
        }
        else {
            res.status(500).json({
                msg: "Internal server error"
            });
        }
    },
    //find all DATE FILTER
    filterByDate: async (req, res) => {
        var inputDate1 = new Date(req.body.from).toISOString();
        var inputDate2 = new Date(req.body.to).toISOString();
        var data = await Blog.find({
            dob: {
                $gte: inputDate1,
                $lt: inputDate2
            }
        })

        if (data) {
            res.status(200).json({
                users: data
            });
        }
        else {
            res.status(500).json({
                msg: "Internal server error"
            });
        }
    },

    async  createNewBlog (req, res) {
        // var newBlog = new Blog(req.body)
        // var newBlog = new Blog({
        //     // name: "Kollol ",
        //     designation: "Software Developer",
        //     dob: "2995-12-25",
        //     age: 26
        // })
        let data = await Blog.create({
            name: "Kollol Ch ",
            designation: "Software Developer",
            dob: "2995-12-25",
            age: 26
        })
        if(data){
            return res.status(200).json({
                data
            });
        }else{
            return res.status(500).json({
                msg: "Internal server error"
            });
        }
        // newBlog.save((error) => {
        //   if (error) {
        //     res.status(500).json({
        //       msg: "Internal server error",error
        //     })
        //   }
        //   else {
        //     res.send("Your data has been added!")
        //   }
        // })
      }

}