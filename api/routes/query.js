const express = require("express");

const router = express.Router();
const queryController = require("../controllers/query");

function queryRouter(io) {
  function ioMiddleware(req, res, next) {
    (req.io = io), next();
  }
  io.on("connection", (socket) => {
    socket.emit("request", { data: "Socket connected" });
    socket.on("reply", (data) => {
      console.log("admin routes => ", data);
    });
  });
  router.put("/reset", queryController.resetPassword);
  router.put("/forgot", queryController.forgotPassword);
  router.post("/login", queryController.Login);
  router.post("/signup", queryController.Signup);

  return router;
}

let queryRouterFile = {
  router: router,
  queryRouter: queryRouter,
};
module.exports = queryRouterFile;
