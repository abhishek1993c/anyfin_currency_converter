const express = require('express');
const router = express.Router();
const { login } = require('../controller/login');
const { countrySearch, countryLookup } = require('../controller/countries');

// routes
router.post('/login', login);
router.get('/countries/lookup/:searchText', countryLookup);
router.get('/countries/search/:text', countrySearch);

module.exports = router;
