const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signatureAccess = process.env.JWT_ACCESS_SECRET;
const signatureRefresh = process.env.JWT_REFRESH_SECRET;

const accessTokenAge = 60;
const refreshTokenAge = 60 * 60;

const getTokens = (id) => {
  return {
    accessToken: jwt.sign({id}, signatureAccess, {
      expiresIn: accessTokenAge
    }),
    refreshToken: jwt.sign({id}, signatureRefresh, {
      expiresIn: `${refreshTokenAge}`
    })
  }
}

module.exports = {
  getTokens,
  refreshTokenAge,
}