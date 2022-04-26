const mongoose = require('mongoose');

//Schema
const Schema = mongoose.Schema;
const BlogSchema = new Schema({
    name: {type:String,required: 1},
    designation: String,
    dob: Date,
    age: Number,
    address: Object
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;