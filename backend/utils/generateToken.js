const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, jwtSecret, { expiresIn });
};

module.exports = generateToken;
