const express = require('express');
const { userAuth } = require('../Middlewares/authentication');
const userRouter = express.Router();
const ConnectionRequestModel = require('../models/connectionRequest');

userRouter.get('/user/requests/pending', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user; 
    const allPendingRequest = await ConnectionRequestModel.find({
      toUserId: loggedUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName", "gender", "age"]);

    res.status(200).json({
      message: "Incoming connection requests fetched successfully",
      data: allPendingRequest,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

module.exports = userRouter;