const express = require('express');
const { userAuth } = require('../Middlewares/authentication');
const userRouter = express.Router();
const ConnectionRequestModel = require('../models/connectionRequest');

const USER_SAFE_DATA = ["firstName", "lastName", "gender", "age"];

userRouter.get('/user/requests/pending', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const allPendingRequest = await ConnectionRequestModel.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.status(200).json({
      message: "Incoming connection requests fetched successfully",
      data: allPendingRequest,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});


userRouter.get('/user/allconnections', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const allConnections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedUser._id, status: "accepted" },
        { toUserId: loggedUser._id, status: "accepted" },
      ]
    }).populate("fromUserId", USER_SAFE_DATA);

    const data = allConnections.map((row) => row.fromUserId);
    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});
module.exports = userRouter;