const { ApiError, Client, Environment } = require('square');

require('dotenv').config();

//const { isProduction, SQUARE_ACCESS_TOKEN } = require('./config');

//console.log("square.js server side access token: ", process.env.SQUARE_ACCESS_TOKEN);

const client = new Client({
  environment: process.env.SQUARE_ENVIRONMENT === 'production' ? Environment.Production : Environment.Sandbox,
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
});

module.exports = { ApiError, client };
