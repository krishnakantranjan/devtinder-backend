const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user')

app.post('/signup', async (req, res) => {
  //Creating a new instance of User model
  const user = new User({
    firstName: "Rohan",
    lastName: "Kumar",
    password: "Rohan@123",
    age: 20,
    gender: "M",
  });
  try {
    await user.save();
    res.send("User added successfully");
  }
  catch (err) {
    res.status(400).send("Error" + err.message);
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


