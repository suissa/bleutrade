const stringify = require("querystring").stringify
const hmac = require("crypto").createHmac
const EventEmitter = require('events').EventEmitter
const io = require('socket.io-client')('https://api.bleutrade.com:8083', {secure: true})
const request = require("request")
const util = require("util")
const publicMethods = ['getmarkets', 'getcurrencies', 'getticker', 'getmarketsummary', 'getmarketsummaries', 'getorderbook', 'getmarkethistory']

const API_URL = 'https://bleutrade.com/api/v2/'
const { API_KEY, API_SECRET } = require('../bleutrade_api')

const axios = require('axios')

const getOptionsPublic = (action, params = {}, data = {}) => ({
  url: 'https://bleutrade.com/api/v2/public/' + action,
  agent: false,
  method: 'GET',
  // jar: args.jar,
  data,
  params,
  headers: {
    "User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
    "Content-type": "application/x-www-form-urlencoded"
  }
})
// market
// period
// count
// lasthours
const getOptionsCandlesPublic = (action, params = {}, data = {}) => ({
  url: 'https://bleutrade.com/api/v2/public/' + action
    + (() => (params.market) ? '?market=' + params.market : '')()
    + (() => (params.period) ? '&period=' + params.period : '')()
    + (() => (params.count) ? '&count=' + params.count : '')()
    + (() => (params.lasthours) ? '&lasthours=' + params.lasthours : '')(),
  agent: false,
  method: 'GET',
  // jar: args.jar,
  data,
  params,
  headers: {
    "User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
    "Content-type": "application/x-www-form-urlencoded"
  }
})

const getOptionsMarket = (action, params = {}, data = {}) => ({
  url: 'https://bleutrade.com/api/v2/market/' 
    + action + '?apikey=' + params.apikey + '&nonce=' + params.nonce
    + (() => (params.orderid) ? '&orderid=' + params.orderid : '')(),
  agent: false,
  method: 'GET',
  // jar: args.jar,
  data,
  // params,
  headers: {
    "User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
    "Content-type": "application/x-www-form-urlencoded"
  }
})

const getOptionsSellMarket = (action, params = {}, data = {}) => ({
  url: 'https://bleutrade.com/api/v2/market/'
    + action + '?apikey=' + params.apikey + '&nonce=' + params.nonce
    + (() => (params.config.market) ? '&market=' + params.config.market : '')()
    + (() => (params.config.rate) ? '&rate=' + params.config.rate : '')()
    + (() => (params.config.quantity) ? '&quantity=' + params.config.quantity : '')(),
  agent: false,
  method: 'GET',
  // jar: args.jar,
  data,
  // params,
  headers: {
    "User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
    "Content-type": "application/x-www-form-urlencoded"
  }
})

const getURL = (action, params) => //API_URL + action + '?' + stringify(params)
  console.log(API_URL + action + '?' + stringify(params))

const getOptionsAccount = (action, params = {}, data = {}) => ({
  // url: getURL(action, params),
  url: 'https://bleutrade.com/api/v2/account/'
    + action + '?apikey=' + params.apikey + '&nonce=' + params.nonce
    + (() => (params.currency) ? '&currency=' + params.currency : '')()
    + (() => (params.orderid) ? '&orderid=' + params.orderid : '')(),
  agent: false,
  method: 'GET',
  // jar: args.jar,
  data,
  // params,
  headers: {
    "User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
    "Content-type": "application/x-www-form-urlencoded"
  }
})

const getOptionsOrdersAccount = (action, params = {}, data = {}) => ({
  // url: getURL(action, params),
  url: 'https://bleutrade.com/api/v2/account/'
    + action + 
    '?apikey=' + params.apikey + 
    '&nonce=' + params.nonce + 
    '&market=' + params.config.market +
    '&orderstatus=' + params.config.orderstatus +
    '&ordertype=' + params.config.ordertype,
  agent: false,
  method: 'GET',
  // jar: args.jar,
  data,
  // params,
  headers: {
    "User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
    "Content-type": "application/x-www-form-urlencoded"
  }
})

const getResult = (result) =>
  (result.data.success === 'true') ? result.data.result : []


const getAPISign = (options, apisecret) => {
  options.headers.apisign = new hmac("sha512", apisecret)
                                    .update(options.url)
                                    .digest('hex')

  return options
}

const actions = {
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

  getcandles: async ({market = 'HTML_BTC', period = '30m', count = 1000, lasthours = 24}) =>{
    const opt = getOptionsCandlesPublic('getcandles',
      {
        market,
        period, // 1m, 2m, 3m, 4m, 5m, 6m, 10m, 12m, 15m, 20m, 30m, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 1d
        count, // default: 1000, max: 999999
        lasthours, // default: 24, max: 2160
      }, {})
      console.log('------------------------------------');
    console.log(opt);
      console.log('------------------------------------');
    getResult(
      await axios(opt))
      },

// Market

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
          getOptionsMarket( 'getopenorders', 
                            { apikey: API_KEY, nonce: Date.now() }
                          ), 
          API_SECRET ))),

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

  getwithdrawhistory: async () =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getwithdrawhistory',
            { apikey: API_KEY, nonce: Date.now() }
          ),
          API_SECRET))),



}


const Bleutrade = (key, secret, requeue = 0) => {
  const config = {}

  config.key = key
  config.secret = secret
  // config.jar = request.jar();
  config.requeue = requeue


  return actions
}

module.exports = Bleutrade;
