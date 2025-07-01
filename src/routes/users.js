const express = require('express');
const { userAuth } = require('../Middlewares/authentication');
const userRouter = express.Router();
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
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
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    // Get the other user in each connection (not the logged-in user)
    const data = allConnections.map((row) => {
      if (row.fromUserId._id.toString() === loggedUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ data });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});


userRouter.get('/feed', userAuth, async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 25;
    limit = limit > 25 ? 25 : limit;
    const skip = (page - 1) * limit;


    const loggedUser = req.user;
    // Get all connection requests involving this user
    const connectionRequest = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedUser._id },
        { toUserId: loggedUser._id }
      ]
    }).select("fromUserId toUserId");

    // Add users involved in connection requests to exclusion set
    const hideUserFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // Also exclude the current user from their own feed
    hideUserFromFeed.add(loggedUser._id.toString());

    // Fetch users not in the connection list and not self
    const filterUsers = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) }
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    return res.status(200).json({
      message: "Feed users fetched successfully",
      users: filterUsers,
    });

  } catch (error) {
    return res.status(400).json({ message: "ERROR: " + error.message });
  }
});
module.exports = userRouter;