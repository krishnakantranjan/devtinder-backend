const express = require('express');
const mongoose = require('mongoose');
const requestRouter = express.Router();

const User = require('../models/user');
const ConnectionRequestModel = require('../models/connectionRequest');
const { userAuth } = require('../Middlewares/authentication');

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const { status, toUserId } = req.params;

    // Validate status
    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(toUserId)) {
      return res.status(400).json({ message: "Invalid or missing toUserId" });
    }

    // Prevent sending request to self
    if (fromUserId.toString() === toUserId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    // Check if recipient user exists
    const toUser = await User.findById({ _id: toUserId });
    if (!toUser) {
      return res.status(404).json({ message: "Recipient user doesn't exist." });
    }

    // Check if a connection request already exists (in either direction)
    const existingRequest = await ConnectionRequestModel.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(409).json({ message: "Connection request already exists." });
    }

    // Create and save new connection request
    const newRequest = new ConnectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });

    const data = await newRequest.save();

    return res.status(201).json({
      message: "Connection request has been sent!" + status,
      data,
    });

  } catch (error) {
    console.error("Connection request error:", error);
    return res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Receiver or toUserId can approve or reject the connection request
requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const { status, requestId } = req.params;

    // Validate status
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid status type. Must be 'accepted' or 'rejected'.",
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request ID format",
      });
    }

    // Check if request exists and belongs to the logged-in user
    const connectionRequest = await ConnectionRequestModel.findOne({
      _id: requestId,
      toUserId: loggedUser._id,
      status: "interested", // only allow review of pending (interested) requests
    });

    if (!connectionRequest) {
      return res.status(404).json({
        message: "No matching connection request found for review",
      });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({
      message: `Connection request ${status} successfully`,
      data,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


module.exports = requestRouter;