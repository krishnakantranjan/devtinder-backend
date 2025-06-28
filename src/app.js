const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateSignUpData } = require('./utils/validation');
app.use(express.json());
app.use(cookieParser());
const { userAuth } = require('./Middlewares/auth');


app.post('/signup', async (req, res) => {
  try {

    //Validation
    validateSignUpData(req);
    //Encryption
    const { firstName, lastName, emailId, password, age, gender } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);


    // Createing the instance of user
    const user = new User(
      {
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        age,
        gender,
      }
    );

    //Save the user
    await user.save();
    res.send(" User added successfully");
  } catch (err) {
    res.status(400).send(" Something went wrong " + err.message);
  }
});

app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    // If emailId exist then is give a object of all data that belong to that emailId
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(400).send("Email does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {


      const token = await jwt.sign({ _id: user._id }, "Dev@Tinder$2204121", {expiresIn : "7d"});
      console.log(token);

      res.cookie("token", token);
      res.send("Login Successfully");
    } else {
      throw new Error("Wrong Password");
    }
  }
  catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

app.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

app.post('/sendConnectionRequest', userAuth, (req, res) => {
  const user = req.user;

  res.send(user.firstName + " sent the connection request!");
});






connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch((error) => {
  console.error('Database connection failed:', error.message);
});


