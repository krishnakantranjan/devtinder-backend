const express = require('express');
const app = express();


app.get('/user', (req, res) => {
  res.send({firstname: 'John', lastname: 'Doe'});
}); 

app.post('/user', (req, res) => {
  // saving data to the database
  res.send('Data saved successfully!');
}); 


//this will match all routes that are /user.
app.use('/user', (req, res) => {
  res.send('Hello, World!');
}); 



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 