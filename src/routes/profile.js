const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../Middlewares/authentication');
const { validateEditProfileData } = require('../utils/validation');
profileRouter.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch (err) {
        res.status(400).send("ERROR " + err.message);
    }
});
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData) {
            throw new Error("Invalid Edit Field");
        }
        const loggedInUser = req.user;
        console.log(loggedInUser);// before value
        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
        console.log(loggedInUser); // after value
        await loggedInUser.save();
        res.send("Update Successful!");
    } catch (err) {
        res.status(400).send("ERROR " + err.message);
    }
});
const bcrypt = require('bcrypt');

profileRouter.patch('/profile/password', userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const loggedInUser = req.user;
        // Validate old password
        const isPasswordValid = await bcrypt.compare(oldPassword, loggedInUser.password);
        if (!isPasswordValid) {
            throw new Error("Wrong Password");
        }
        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        loggedInUser.password = hashedPassword;
        await loggedInUser.save();
        res.send("Password Updated Successfully!");
    } catch (err) {
        res.status(400).send("ERROR " + err.message);
    }
});
module.exports = profileRouter;