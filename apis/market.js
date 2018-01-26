const axios = require('axios')
const API_URL = 'https://bleutrade.com/api/v2/'
const { API_KEY, API_SECRET } = require('../../bleutrade_api')

const config = {
  API_URL, API_KEY, API_SECRET
}

const { getResult, getAPISign } = require('../helpers')


const getOptionsMarket = require('./getOptionsMarket')(config)
const getOptionsSellMarket = require('./getOptionsSellMarket')(config)

module.exports = {
  buylimit: async (orderid) =>
    getResult(
      await axios(
        getAPISign(
          getOptionsMarket('buylimit',
            { apikey: API_KEY, nonce: Date.now(), orderid }
          ),
          API_SECRET))),

  selllimit: async (config) =>
    getResult(
      await axios(
        getAPISign(
          getOptionsSellMarket('selllimit',
            { apikey: API_KEY, nonce: Date.now(), config }
          ),
          API_SECRET))),

  cancel: async (orderid) =>
    getResult(
      await axios(
        getAPISign(
          getOptionsMarket('cancel',
            { apikey: API_KEY, nonce: Date.now(), orderid }
          ),
          API_SECRET))),

  getopenorders: async () =>
    getResult(
      await axios(
        getAPISign(
          getOptionsMarket('getopenorders',
            { apikey: API_KEY, nonce: Date.now() }
          ),
          API_SECRET))),

}