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

const { getResult, getAPISign, getURL } = require('./helpers')

const actions = {
  public: require('./apis/public'),
  market: require('./apis/market'),
  account: require('./apis/account'),
  bonus: require('./apis/bonus')
}

// console.log(actions.bonus.getPriceChange);
// console.log('------------------------------------');
// (async () => {
//   const fn = actions.bonus.getPriceChange
//   console.log('getPriceChange: ', await fn())})()
  // console.log(RSI(getCandles(listCandle, 1) ))


const Bleutrade = (key, secret, requeue = 0) => {
  const config = {}

  config.key = key
  config.secret = secret
  // config.jar = request.jar();
  config.requeue = requeue


  return Object.assign(actions, Suisseba)
}

module.exports = Bleutrade;
