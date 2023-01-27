const mongoose = require("mongoose");

//user schema
const adminSchema = mongoose.Schema({
  name:{
    type: String,
    default:''
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

 
});
//user Model
module.exports.Admin = mongoose.model("Admin", adminSchema);
