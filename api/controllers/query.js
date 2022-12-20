const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Administration = require("../models/query");
const httpStatus = require("http-status");
const Users = require("../models/users");
const saltRounds = 10;
const { sendResetPasswordEmail } = require("../utils/sendEmail");

// remove c
module.exports.Login = (req, res, next) => {
  console.log(req.body);
  const { userName, password } = req.body;

  Users.findOne({ userName: userName })
    .exec()
    .then(async (foundObject) => {
      console.log("ali", foundObject);
      if (foundObject) {
        await bcrypt.compare(
          password,
          foundObject.password,
          async (err, newResult) => {
            if (err) {
              return res.status(501).json({ error, err });
            } else {
              if (newResult) {
                const token = jwt.sign(
                  { ...foundObject.toObject(), password: "" },
                  "secret",
                  {
                    expiresIn: "5d",
                  }
                );

                return res.status(200).json({
                  token: token,
                });
              } else {
                return res.status(401).json({
                  message: "invalid password",
                });
              }
            }
          }
        );
      } else {
        return res.status(404).json({
          message: "UserName Invalid",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports.Signup = async (req, res, next) => {
  console.log(req.body, "signup");
  const { email, password } = req.body;

  Users.findOne({ email: email })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        return res.status(403).json({
          message: "UserName Already exist",
        });
      } else {
        await bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(" error: ", err);
            return res.status(500).json({ error: err });
          } else {
            let newAdmin = new Users({
              email: email,
              password: hash,
            });

            newAdmin
              .save()
              .then(async (savedObject) => {
                console.log("savedObject", savedObject);

                const token = jwt.sign(
                  { ...savedObject.toObject(), password: "" },
                  "secret",
                  {
                    expiresIn: "5d",
                  }
                );

                return res.status(201).json({
                  message: "sign up successful",
                  token: token,
                });
              })
              .catch((err) => {
                console.log("Not saved", err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};

module.exports.getAllOrders = (req, res, next) => {
  console.log("assignDriver", req.body);
  Order.find()
    .populate("customerId")
    .populate("driverId")
    .exec()
    .then((data) => {
      req.io.emit("broadcast", { message: "Data Sent" });
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
module.exports.forgotPassword = async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(
  //   req.body.email
  // );
  console.log(req.body, "email");
  let user = await Users.findOne({ email: req.body.email });
  if (!user) {
    return res.status(403).json({
      message: "Email not associated with any account",
    });
  } else {
    var val = Math.floor(1000 + Math.random() * 9000);
    console.log("====", user);
    let setOtp = {
      expireIn: new Date().getTime() + 300 * 1000,
    };
    user["code"] = val;
    user["expireIn"] = new Date().getTime() + 300 * 1000;
    user = await user.save();
    // const updatedUser = Users.findByIdAndUpdate(
    //   user._id,
    //   { setOtp },
    //   {
    //     new: true,
    //   }
    // );

    if (user) {
      await sendResetPasswordEmail(req.body.email, val);
      res.status(httpStatus.NO_CONTENT).send();
    }
  }
};
module.exports.resetPassword = async (req, res) => {
  let user = await Users.findOne({
    email: req.body.email,
    code: req.body.code,
  });
  if (!user) {
    return res.status(403).json({
      message: "code is incorrect",
    });
  } else {
    let currentTime = new Date().getTime();
    let diff = user.expireIn - currentTime;
    if (diff < 0) {
      return res.status(403).json({
        message: "Token Expire",
      });
    } else {
      await bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(" error: ", err);
          return res.status(500).json({ error: err });
        } else {
          let found = await Users.findOne({ email: req.body.email });
          found.password = hash;

          found
            .save()
            .then(async (savedObject) => {
              console.log("savedObject", savedObject);

              return res.status(201).json({
                message: "password changed successful",
              });
            })
            .catch((err) => {
              console.log("Not changed", err);
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    }
  }
};
