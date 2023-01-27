const mongoose = require("mongoose");

//user schema
const blogSchema = mongoose.Schema({
  title:{
    type: String,
    default:''
  },
  title2:{
    type: String,
    default:''
  },
  description: {
    type: String,
   
  },
  publisherName: {
    type: String,
  },
  p1: {
    type: String,
  },
  p2: {
    type: String,
  },
  p3: {
    type: String,
  },
  p4: {
    type: String,
  },
  date: {
    type: String,
  },
  img1: {
    type: String,
  },
  img2: {
    type: String,
  },

 
});
//user Model
module.exports.Blog = mongoose.model("Blog", blogSchema);
