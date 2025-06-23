const express = require('express');
const { adminAuth, userAuth } = require('./Middlewares/auth');
const app = express();

app.get('/', (err, req, res, next) => {
  if(err) {
    return res.status(500).send('Internal Server Error');
  }
  res.send('Welcome to the Home Page');
})



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 