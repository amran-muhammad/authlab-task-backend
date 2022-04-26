const mongoose = require('mongoose');
var crypto = require('crypto'); 

//Schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {type:String,required: 1},
    course: String,
    department: String,
    salt:String,
    hash: String,
    studentID: String,
    email: String,
    type: String,
    status: String,
    token:[]
});
// Method to set salt and hash the password for a user 
UserSchema.methods.setPassword = function(password) { 
     
    // Creating a unique salt for a particular user 
       this.salt = crypto.randomBytes(16).toString('hex'); 
     
       // Hashing user's salt and password with 1000 iterations, 
        
       this.hash = crypto.pbkdf2Sync(password, this.salt,  
       1000, 64, `sha512`).toString(`hex`); 
   }; 
     
   // Method to check the entered password is correct or not 
   UserSchema.methods.validPassword = function(password) { 
       var hash = crypto.pbkdf2Sync(password,  
       this.salt, 1000, 64, `sha512`).toString(`hex`); 
       return this.hash === hash; 
   }; 

const User = mongoose.model('User', UserSchema);
module.exports = User;