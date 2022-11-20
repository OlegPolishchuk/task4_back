const express = require('express');
const User = require('../models/User');
const {Promise} = require("mongoose");

const userRouter = express.Router();

userRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({users})
  } catch (e) {
    res
      .status(500)
      .json({message: 'userRouter.get'})
  }
})

userRouter.put('/updateUsers', async (req, res) => {
  try {

  } catch (e) {
    res
      .status(500)
      .json({message: 'userRouter.put'})
  }
})

userRouter.delete('/users', async (req, res) => {
  const usersId = req.body;

  try {
    const promises = usersId.map(id => User.deleteOne({_id: id}))
    const result = await Promise.all(promises);

    res
      .status(200)
      .json(result);
  } catch (e) {
    res
      .status(500)
      .json({message: 'userRouter.delete'})
  }
})

userRouter.put('/users', async (req, res) => {
  const users = req.body;

  try {
    const promises = users.map(user => User.updateOne(
      {_id: user._id}, { $set:{status: user.status}}));
    const result = await Promise.all(promises);

    res
      .status(200)
      .json(result)
  } catch (e) {
    res
      .status(500)
      .json({message: 'userRouter.put'})
  }

  console.log(users)
})

module.exports = userRouter;