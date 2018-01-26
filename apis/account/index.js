const axios = require('axios')
const API_URL = 'https://bleutrade.com/api/v2/'
const { API_KEY, API_SECRET } = require('../../bleutrade_api')

const config = {
  API_URL, API_KEY, API_SECRET
}

const { getResult, getAPISign, getURL } = require('../../helpers')(config)

const getOptionsAccount = require('./getOptionsAccount')

module.exports = {
  getbalances: async (currencies = '') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getbalances',
            { apikey: API_KEY, nonce: Date.now(), currencies }
          ),
          API_SECRET))),

  getbalance: async (currency = 'HTML') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getbalance',
            { apikey: API_KEY, nonce: Date.now(), currency }
          ),
          API_SECRET))),

  getdepositaddress: async (currency = 'HTML') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getdepositaddress',
            { apikey: API_KEY, nonce: Date.now(), currency }
          ),
          API_SECRET))),

  getorder: async (orderid = '84545304') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getorder',
            { apikey: API_KEY, nonce: Date.now(), orderid }
          ),
          API_SECRET))),

  getorderhistory: async (orderid) => // orderid
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getorderhistory',
            { apikey: API_KEY, nonce: Date.now(), orderid }
          ),
          API_SECRET))),

  getdeposithistory: async () =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getdeposithistory',
            { apikey: API_KEY, nonce: Date.now() }
          ),
          API_SECRET))),

  getwithdrawhistory: async () =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getwithdrawhistory',
            { apikey: API_KEY, nonce: Date.now() }
          ),
          API_SECRET))),

  // getwithdrawhistory: async () =>
  //   getResult(
  //     await axios(
  //       getAPISign(
  //         getOptionsAccount('getwithdrawhistory',
  //           { apikey: API_KEY, nonce: Date.now() }
  //         ),
  //         API_SECRET))),
}