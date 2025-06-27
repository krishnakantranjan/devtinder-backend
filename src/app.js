const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const { validateSignUpData } = require('./utils/validation');
app.use(express.json());

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
    console.log(user); // Object of data of user
    if (!user) {
      return res.status(400).send("Email does not exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid); // Boolen value if password matched. 
    if (isPasswordValid) {
      res.send("Login Successfully");
    } else {
      throw new Error("Wrong Password");
    }
  }
  catch (err) {
    res.status(400).send("ERROR " + err.message);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});


app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const UPDATE_ALLOWED = ["firstName", "lastName", "gender", "age"];
    const isUpdateAllowed = Object.keys(data).every((k) => UPDATE_ALLOWED.includes(k));

    if (!isUpdateAllowed) {
      throw new Error(" Update is not allowed");
    }

    if (data.age <= 0) {
      throw new Error(" Age is not valid");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("Update Successfully");
  } catch (err) {
    res.status(400).send("Update Failed" + err.message);
  }
});











connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch((error) => {
  console.error('Database connection failed:', error.message);
});


