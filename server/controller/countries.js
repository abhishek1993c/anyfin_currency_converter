const axios = require('axios');
const config = require('../config.json');
// full name, population and a list of its official currencies including current exchange rate to SEK
module.exports.countryLookup = (req, res, next) => {
  let searchText = req.params.searchText;
  let responseObj = {
    name: '',
    population: '',
    currencies: [],
  };
  if (!searchText || searchText.length == 0) {
    res.status(500).send('No input provided.');
    return;
  }
  axios
    .get(`https://restcountries.eu/rest/v2/name/${searchText}`)
    .then((response1) => {
      response1 = response1.data.filter((rec) => rec.name === searchText)[0];

      responseObj.name = response1.name;
      responseObj.population = response1.population;
      let currencies = response1.currencies.map((curr) => curr.code);
      currencies.push('SEK');
      currencies = currencies.join();
      axios
        .get(
          `http://data.fixer.io/api/latest?access_key=${config.data_fixer_access_key}&symbols=${currencies}`
        )
        .then((response2) => {
          responseObj.currencies = response2.data.rates;
          if (Object.keys(responseObj.currencies).length > 1) {
            for (key in responseObj.currencies) {
              responseObj.currencies[key] =
                responseObj.currencies['SEK'] / responseObj.currencies[key];
              responseObj.currencies[key] =
                Math.round(responseObj.currencies[key] * 100) / 100;
            }
          }
          if (responseObj.currencies['SEK']) {
            if (Object.keys(responseObj.currencies).length > 1) {
              delete responseObj.currencies['SEK'];
            } else {
              responseObj.currencies['SEK'] = 1;
            }
          }
          res.status(200).send(responseObj);
        })
        .catch((err) => {
          console.log(err);
          res
            .status(500)
            .send('Data.fixer.io API failed. Please try again after sometime.');
        });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send('Restcountries API failed. Please try again after sometime.');
    });
};

module.exports.countrySearch = (req, res, next) => {
  let text = req.params.text;
  axios
    .get(`https://restcountries.eu/rest/v2/name/${text}`)
    .then((response) => {
      let responseObj = [];
      responseObj = response.data.map((rec) => {
        return rec.name;
      });
      res.status(200).send(responseObj).end();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(err).end();
    });
};
