const express = require('express');
const { adminAuth, userAuth } = require('./Middlewares/auth');
const app = express();

// Middleware to check authorization
app.use('/admin', adminAuth);

app.use('/user', userAuth, (req, res, next) => {
  res.send('User data sent successfully');
});


app.get('/admin/getAllData', (req, res) => {
  res.send('Data sent successfully');
});

app.get('/admin/deleteUser', (req, res) => {
  res.send('User deleted successfully');
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 