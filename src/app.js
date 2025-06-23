const express = require('express');
const app = express();

/*
app.use('/user',
  (req, res) => {
  res.send('Route handler 1');
},
  (req, res) => {
    res.send('Route handler 2');
  }
);

// res.send -> Route handler 1
*/
/*
app.use('/user',
  (req, res) => {
  // res.send('Route handler 1');
},
  (req, res) => {
    res.send('Route handler 2');
  }
);

// request will hang.
*/
/*
app.use('/user',
  (req, res, next) => {
    // res.send('Route handler 1');
    next();
  },
  (req, res) => {
    res.send('Route handler 2');
  }
);

// res.send -> Route handler 2
*/
/*
app.use('/user',
  (req, res, next) => {
    res.send('Route handler 1');
    next();
  },
  (req, res) => {
    res.send('Route handler 2');
  }
);

// res.send -> Route handler 1
*/

// We can put route handlers in an array.
// it work as same.






app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
}); 