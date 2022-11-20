const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./src/routes/authRouter');
const userRouter = require('./src/routes/usersRouter');

const app = express();
dotenv.config();


const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;


app.use(cors({
  origin: "http://localhost:3000",
}));
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(userRouter);


const start = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.koqzweg.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`)

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }
}
start();


