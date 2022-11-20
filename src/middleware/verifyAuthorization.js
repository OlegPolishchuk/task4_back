const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const signatureAccess = process.env.JWT_ACCESS_SECRET;

const verifyAuthorization = (req, res, next) => {
  const token = req.headers.authorization
    ? req.headers.authorization.split(' ')[1]
    : '';

  if (!token) {
    return res.status(401).json({message: '!token'});
  }

  try{
    const decoded = jwt.verify(token, signatureAccess);

    console.log(`decoded =>`, decoded)
    req.user = decoded;

    next();

  } catch (e) {
    return res.status(401).json({message: 'token !== token'})
  }

}

module.exports = verifyAuthorization;