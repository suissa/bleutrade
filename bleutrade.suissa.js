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


    // api_query('getorderbook', callback, { market: market, period: period, count: count, lasthours: lasthours });
  

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

  // getwithdrawhistory: async () =>
  //   getResult(
  //     await axios(
  //       getAPISign(
  //         getOptionsAccount('getwithdrawhistory',
  //           { apikey: API_KEY, nonce: Date.now() }
  //         ),
  //         API_SECRET))),


}

const getPercentage = (total, percent) => total * ( percent / 100 )


const getDailyChange = (coin) => {

  const prevDay = coin.PrevDay
  const curDay = coin.Last
}


const coin_example = {
  MarketName: 'ADC_BTC',
  MarketCurrency: 'Audiocoin',
  BaseCurrency: 'Bitcoin',
  PrevDay: '0.00000105',
  High: '0.00000127',
  Low: '0.00000097',
  Last: '0.00000120',
  Average: '0.00000110',
  Volume: '211793.48142899',
  BaseVolume: '0.23197773',
  TimeStamp: '2018-01-23 18:57:18',
  Bid: '0.00000107',
  Ask: '0.00000111',
  IsActive: 'true'
}

const byMarketname_BTC = (coin) => coin.MarketName.endsWith('_BTC')

const byPositiveAverageDailyChange = (coin) => Number(coin.Average) > Number(coin.PrevDay)
const byPositiveLastDailyChange = (coin) => Number(coin.Last) > Number(coin.PrevDay)
const byPositiveLastOrAVGDailyChange = (coin) => 
  (Number(coin.Last) > Number(coin.PrevDay) || Number(coin.Average) > Number(coin.PrevDay))

const byLastAndAVGChangesPositives = (coin) => 
  (Number(coin.LastChange) > 0.00 && Number(coin.AverageChange) > 0.00)

const byPositiveChangeAndLastAboveAVG = (coin) => coin.Last < coin.Average


const byASC = (field) => (a, b) => {
  if (Number(a[field]) > Number(b[field])) {
    return 1;
  }
  if (Number(a[field]) < Number(b[field])) {
    return -1;
  }
  // a must be equal to b
  return 0;
}
const byDESC = (field) => (a, b) => {
  if (Number(a[field]) > Number(b[field])) {
    return -1;
  }
  if (Number(a[field]) < Number(b[field])) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

const getProportion = (x, y) => x / y 

const getChange = (lower, bigger) => ( bigger / lower - 1 ) * 100

const toChangeData = (coin) => {
  const obj = {}
  // console.log('------------------------------------');
  // // console.log('coin: ', coin);
  // console.log('coin.BaseCurrency: ', coin.BaseCurrency);
  // console.log('coin.MarketName: ', coin.MarketName);
  // console.log('------------------------------------');

  obj.MarketName = coin.MarketName

  obj.AverageChange = Number(Number(getChange(coin.PrevDay, coin.Average)).toFixed(2))
  obj.LastChange = Number(Number(getChange(coin.PrevDay, coin.Last)).toFixed(2))

  obj.PrevDay = Number(coin.PrevDay)
  obj.Last = Number(coin.Last)
  obj.Average = Number(coin.Average)
  
  return obj
}


const moreVolatile = async () => {
  try {
    const res = await actions.getmarketsummaries()

    const result = res.filter(byPositiveLastDailyChange)
      .map(toChangeData)
      .filter(byMarketname_BTC)
      .filter(byLastAndAVGChangesPositives)
      .sort(byDESC('LastChange'))

    return result
  } catch (error) {
    throw new Error(error.stack)
  }
}

const getPositiveChangeAndLastAboveAVG = async () => {
  try {
    const res = await moreVolatile()

    const result = res.filter(byPositiveChangeAndLastAboveAVG)
    return result
  } catch (error) {
    throw new Error(error.stack)
  }

}

const listCandle = [{
  "TimeStamp": "2014-07-29 18:08:00",
  "Quantity": 654971.69417461,
  "Price": 0.00030,
  "Total": 2,
  "OrderType": "BUY"
}, {
    "TimeStamp": "2014-07-29 18:08:15",
    "Quantity": 654971.69417461,
    "Price": 0.00030,
    "Total": 2,
    "OrderType": "BUY"
  }, {
    "TimeStamp": "2014-07-29 18:08:35",
    "Quantity": 120.00000000,
    "Price": 0.00029,
    "Total": 2,
    "OrderType": "BUY"
  }, {
    "TimeStamp": "2014-07-29 18:08:45",
    "Quantity": 120.00000000,
    "Price": 0.00025,
    "Total": 2,
    "OrderType": "SELL"
    // }, {
  }, {
    "TimeStamp": "2014-07-29 18:08:55",
    "Quantity": 120.00000000,
    "Price": 0.00022,
    "Total": 2,
    "OrderType": "SELL"
  //   "TimeStamp": "2014-07-29 18:09:35",
  //   "Quantity": 120.00000000,
  //   "Price": 0.00000029,
  //   "Total": 0.360234432,
  //   "OrderType": "BUY"
  // }, {
  //   "TimeStamp": "2014-07-29 18:10:05",
  //   "Quantity": 120.00000000,
  //   "Price": 0.00000029,
  //   "Total": 0.360234432,
  //   "OrderType": "BUY"
  }
]
// getcandles: async ({ market = 'HTML_BTC', period = '30m', count = 1000, lasthours = 24 }) => {
//   const opt = getOptionsCandlesPublic('getorderbook',
//     {
//       market,
//       period, // 1m, 2m, 3m, 4m, 5m, 6m, 10m, 12m, 15m, 20m, 30m, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 1d
//       count, // default: 1000, max: 999999
//       lasthours, // default: 24, max: 2160
//     }, {})
//   console.log('------------------------------------');
//   console.log(opt);
//   console.log('------------------------------------');
//   getResult(
//     await axios(opt))
// },

// const toCandles = (obj, cur, i, list) => {
//   const start = new Date( list[0].TimeStamp ).getTime()
//   const minute = 60000
//   const end = start - minute

//   const time = new Date(cur.TimeStamp).getTime()

//   if (time <= start && time >= end) {
//     obj[1] = (!obj[1]) ? [cur] : [...obj[1], cur]

//     return obj
//   }

//   return obj
// }

const getCandleType = (obj) =>  
  (obj.Open === obj.Close)
    ? 'neutral'
    : (obj.Open < obj.Close)
      ? 'green'
      : 'red'
const toCandle = (obj, cur, i, list) => {
  if (!i) {
    obj.TimeStamp = cur.TimeStamp
    obj.TimeStampFirst = cur.TimeStamp
    obj.TimeStampLast = cur.TimeStamp

    obj.Buyers = (cur.OrderType.toLowerCase() === 'buy') ? 1 : 0
    obj.Sellers = (cur.OrderType.toLowerCase() === 'sell') ? 1 : 0
    obj.Last = cur.Price
    obj.Open = cur.Price
    obj.High = cur.Price
    obj.Low = cur.Price
    obj.Close = cur.Price
    obj.Type = getCandleType(obj)

    obj.AVGOpenClose = 0
    obj.AVGHighLow = 0

    obj.Volume = cur.Total
    obj.BaseVolume = obj.Volume
    obj.BaseVolumeAVG = obj.Volume
    return obj
  }
  if (i + 1 === list.length) {
    obj.Close = cur.Price
    obj.Type = getCandleType(obj)
    obj.TimeStampLast = cur.TimeStamp
    obj.AVGOpenClose = ((obj.Open + obj.Close) / 2)
  }

  obj.High = (cur.Price > obj.High) ? cur.Price : obj.High
  obj.Low = (cur.Price < obj.Low) ? cur.Price : obj.Low

  obj.Buyers = (cur.OrderType.toLowerCase() === 'buy') ? obj.Buyers + 1 : obj.Buyers
  obj.Sellers = (cur.OrderType.toLowerCase() === 'sell') ? obj.Sellers + 1 : obj.Sellers


  obj.AVGHighLow = ((obj.High + obj.Low) / 2)

  obj.Volume = obj.Volume + cur.Total
  obj.BaseVolumeAVG = obj.Volume * obj.AVGHighLow
  obj.BaseVolume = obj.Volume * obj.Last

  return obj
}

// {
//   "success": "true",
//     "message": "",
//       "result": [{
//         "TimeStamp": "2014-07-31 10:15:00",
//         "Open": "0.00000048",
//         "High": "0.00000050",
//         "Low": "0.00000048",
//         "Close": "0.00000049",
//         "Volume": "594804.73036048",
//         "BaseVolume": "0.11510368"
//       }, {
//         "TimeStamp": "2014-07-31 10:00:00",
//         "Open": "0.00000037",
//         "High": "0.00000048",
//         "Low": "0.00000035",
//         "Close": "0.00000048",
//         "Volume": "623490.14936407",
//         "BaseVolume": "0.13101303"
//       }
//       ]
// }
const getCandles = (listCandle) => {
// ({ market = 'HTML_BTC', size = 1, count = 1000, period = 24 }) => {
  const list = listCandle.reverse()
  const candleSize = 1
  
  // const candles = list.reduce(toCandle(candleSize), {})
  const candles = list.reduce(toCandle, {})
  console.log('------------------------------------');
  console.log('candles: ', candles);
  console.log('------------------------------------');
}

console.log(getCandles(listCandle))
// const RS = (list, period) => 
// const RSI = (period) => (list) => 100 – (100 / (1 + RS(list, period)))

const Suisseba = {
  moreVolatile,
  getPositiveChangeAndLastAboveAVG
}

const sum = (x, y) => x + y
const divide = (x, y) => x / y 
const avg = (...list) => divide(list.reduce(sum, 0), list.length)
const decimals = (decimal) => (x) => Number(Number(x).toFixed(decimal))

// const with2decimals = decimals(2)
// avg(2, 2, 3, 3, 10, 10, 10)
// with2decimals(avg(2,2,3,3,10,10,10))

// RSI = 100 – 100 / (1 + RS *)

//   * RS = Média de X dias de alta / Média de X dias de baixa.

// A quantidade de períodos padrão é 14, sendo que 9 e 28 também são comumente utilizados.Geralmente, mais períodos tendem a gerar dados mais precisos.

const Bleutrade = (key, secret, requeue = 0) => {
  const config = {}

  config.key = key
  config.secret = secret
  // config.jar = request.jar();
  config.requeue = requeue


  return Object.assign(actions, Suisseba)
}

module.exports = Bleutrade;
