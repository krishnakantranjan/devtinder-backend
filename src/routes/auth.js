const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('../utils/validation');

authRouter.post('/signup', async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({ firstName, lastName, emailId, password: passwordHash, age, gender });
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Something went wrong " + err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) return res.status(400).send("Email does not exist");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Wrong Password");

    const token = await user.getJWT();
    res.cookie("token", token);
    res.send("Login Successfully");
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("LogOut Successful!")
});
module.exports = authRouter;