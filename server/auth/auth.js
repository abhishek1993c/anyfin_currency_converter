const jwt = require('jsonwebtoken');
const config = require('../config.json');

const users = [
  {
    id: 1,
    username: 'anyfin',
    password: 'anyfin',
    firstName: 'Test',
    lastName: 'Account',
  },
  {
    id: 2,
    username: 'abhishek',
    password: 'abhishek',
    firstName: 'Abhishek',
    lastName: 'Chakraborty',
  },
];

async function generateToken(user) {
  const isValid = users.find(
    (u) => u.username === user.id && u.password === user.password
  );

  if (!isValid) {
    return { valid: false, token: '' };
  }

  const token = jwt.sign(
    {
      user: {
        username: isValid.username,
        firstName: isValid.firstName,
        lastName: isValid.lastName,
      },
    },
    config.jwt_secret,
    { expiresIn: '1d' }
  );

  return { valid: true, token: token };
}
function authenticateToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return { valid: false, message: 'no token passed' };

  jwt.verify(token, config.jwt_secret, (err, user) => {
    if (err) {
      console.log(err);
      return { valid: false, message: 'invalid token' };
    }
    return { valid: true, user: user };
  });
}

module.exports = {
  generateToken,
  authenticateToken,
};
