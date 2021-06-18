const express = require('express');
const app = express();
const jwt = require('./auth/jwt');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

app.use(express.json());
app.use(cors());

app.use(jwt());

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
});

app.use(limiter);

app.use('/', require('./routes/user'));

// start server
const port = 5000;
const server = app.listen(port, function () {
  console.log('Server listening on port ' + port);
});
