const express = require('express');
const app = express();
/*
app.get('/admin/getalldata', (req, res) => {
  const token = "xyz";
  const isAuthorised = token === "xyz";
  if (!isAuthorised) {
    return res.status(403).send('Forbidden');
  }
  else {
    res.send('Data sent successfully');
  }
});

app.get('/admin/deleteUser', (req, res) => {
  const token = "xyz";
  const isAuthorised = token === "xyz";
  if (!isAuthorised) {
    return res.status(403).send('Unauthorized');
  }
  else {
    res.send('User deleted successfully');
  }
});
*/

// Middleware to check authorization
app.use('/admin', (req, res, next) => {
  const token = "xyz";
  const isAuthorized = token === "xyz"; // Replace with actual authorization logic
  if (!isAuthorized) {
    return res.status(403).send('Unauthorized');
  }
  else {
    next();
  }
});

app.get('/admin/getalldata', (req, res) => {
  res.send('Data sent successfully');
});

app.get('/admin/deleteUser', (req, res) => {
  res.send('User deleted successfully');
});






app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 