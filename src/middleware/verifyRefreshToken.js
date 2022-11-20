const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signatureRefresh = process.env.JWT_REFRESH_SECRET;


const verifyRefreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({message: 'something with refresh token'});
  }

  try {
    const decoded = jwt.verify(refreshToken, signatureRefresh);

    console.log(`decoded:`, decoded)
    req.user = decoded;

    next();

  } catch (e) {
    return res.sendStatus(401)
  }
}

module.exports = verifyRefreshToken;