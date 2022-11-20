const express = require('express');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
const User = require('../models/User');
const {refreshTokenAge, getTokens} = require('../utils/getTokens');
const verifyAuthorization = require('../middleware/verifyAuthorization');
const verifyRefreshToken = require('../middleware/verifyRefreshToken');

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const {login, password} = req.body;

  const user = await User.findOne({login});

  if (!user) {
    return res.status(401).json({message: 'User does not exist'});
  }

  user.lastLogin = Date.now();
  await user.save();

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  const userStatus = user.status;

  if (!isPasswordCorrect) {
    return res.status(401).json({message: 'Wrong password'})
  }

  if (userStatus === 'blocked') {
    return res.status(401).json({message: 'User has blocked'})
  }

  const {accessToken, refreshToken} = getTokens(user._id);

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: refreshTokenAge,
    })
  );

  res.send({
    user,
    accessToken,
  })
})

authRouter.post('/register', async (req, res) => {
  try{
    const {login, password, email} = req.body;

    const isUser = await User.findOne({login});

    if (isUser) {
      return res.status(401).json({message: 'This username is already exist'})
    }

    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      login,
      password: hashPassword,
      email,
      created: Date.now(),
      lastLogin: Date.now(),
      status: 'active'
    });

    await newUser.save((e)=> console.log(e));

    return res.status(201).json({});


  } catch (e) {
    return res.status(500).json({
      message: 'Registration error: something went wrong'
    })
  }
})

authRouter.get('/logout', (req, res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refreshToken', '', {
      httpOnly: true,
      maxAge: 0,
    })
  )

  res.sendStatus(200);
})

authRouter.get('/me', verifyAuthorization, async (req, res) => {
  const id = req.user.id;

  const user = await User.findById(id);


  if (!user) {
    return res.status(401).json({message: 'something with token'})
  }


  res.status(200).json({user})

})

authRouter.get('/refresh', verifyRefreshToken, (req, res) => {
  const {accessToken, refreshToken} = getTokens(req.user.id);

  res.setHeader(
    'Set-Cookie',
    cookie.serialize('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 100 * 60 * 60,
    })
  )

  res.send({accessToken});
})


authRouter.post('/isLoginExist', async (req, res) => {
  try {
    const {login} = req.body;
    const isUser = await User.findOne({login});

    if (isUser) {
      return res.status(401).json({message: 'Login already exists'})
    }

    res.status(200).json({message: 'Login is ok'});
  } catch (e) {
    return res.status(500).json({
      message: 'Registration error: something went wrong'
    })
  }
})


module.exports = authRouter;