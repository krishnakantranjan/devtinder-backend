const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user')

app.use(express.json());

app.post('/signup', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//Getting users by firstname
app.get('/user', async (req, res) => {
  const userFirstname = req.body.firstName;

  try {
    const user = await User.find({ firstName: userFirstname });
    if (user.length === 0) {
      res.status(400).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
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


