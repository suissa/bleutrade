const axios = require('axios')
const API_URL = 'https://bleutrade.com/api/v2/'

const config = {
  API_URL
}

const { getResult, getAPISign, getURL } = require('../../helpers')(config)

const getOptionsPublic = require('./getOptionsPublic')(config)
const getOptionsCandlesPublic = require('./getOptionsCandlesPublic')(config)

module.exports = {
  getcurrencies: async (args = {}) =>
    getResult(await axios(getOptionsPublic('getcurrencies', args))),

  getmarkets: async (args = {}) =>
    getResult(await axios(getOptionsPublic('getmarkets', args))),

  getticker: async (market = 'HTML_BTC') =>
    getResult(await axios(getOptionsPublic('getticker', { market }, {}))),

  getmarketsummaries: async () =>
    getResult(await axios(getOptionsPublic('getmarketsummaries'))),

  getmarketsummary: async (market = 'HTML_BTC') =>
    getResult(await axios(getOptionsPublic('getmarketsummary', { market }, {}))),

  getmarkethistory: async (market = 'HTML_BTC', count = 20) =>
    getResult(await axios(getOptionsPublic('getmarkethistory', { market, count }, {}))),

  // getorderbook: async (market = 'HTML_BTC', type = 'ALL', depth = 20) =>
  //   getResult(await axios(getOptionsPublic('getorderbook', { market }, {}))),


    // api_query('getorderbook', callback, { market: market, period: period, count: count, lasthours: lasthours });
  
}