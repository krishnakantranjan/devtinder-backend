const express = require('express');
const app = express();
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

// Routers
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/users');

// Use routers
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

// Connect DB and start server
connectDB().then(() => {
  console.log('Database connected successfully');
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}).catch((error) => {
  console.error('Database connection failed:', error.message);
});
