const mongoose = require("mongoose");

const users = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  code: String,
  expireIn: String,
});

module.exports = mongoose.model("Users", users);
