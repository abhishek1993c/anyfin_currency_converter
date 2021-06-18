const { generateToken } = require('../auth/auth');

module.exports.login = (req, res, next) => {
  let user = req.body.user;
  if (!user || !user.id || !user.password) {
    console.warn('No credentials');
    res.status(200).send({ msg: 'No credentials' }).end();
    return;
  }
  generateToken(user).then((response) => {
    if (response.valid) {
      res.status(200).send(response.token).end();
    } else {
      res.status(500).send({ msg: 'Invalid creadentials' }).end();
    }
    next();
  });
};
