const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user')

app.use(express.json());

app.post('/signup', async (req, res) => {
  // console.log(req.body); // Undefined
  // We need a middleware to change the json into js object -> app.use(express.json());
  console.log(req.body); 
});


connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch((error) => {
  console.error('Database connection failed:', error.message);
});


