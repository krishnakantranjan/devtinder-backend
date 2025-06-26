const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user')

app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    const existingUser = await User.findOne({ emailId: user.emailId });
    if (existingUser) {
      throw new Error(" EmailId already exists: " + user.emailId);
    }
    await user.save();
    res.send(" User added successfully");
  } catch (err) {
    res.status(400).send(" Something went wrong " + err.message);
  }
});

app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
})


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


