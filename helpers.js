const hmac = require("crypto").createHmac
const stringify = require("querystring").stringify

const getChange = (lower, bigger) => (bigger / lower - 1) * 100

const getURL = (config) => (action, params) => //API_URL + action + '?' + stringify(params)
  console.log(config.API_URL + action + '?' + stringify(params))

const getResult = (result) =>
  (result.data.success === 'true') ? result.data.result : []


const getAPISign = (options, apisecret) => {
  options.headers.apisign = new hmac("sha512", apisecret)
                                    .update(options.url)
                                    .digest('hex')

  return options
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

const getDateTimestamp = (timeStamp) => new Date(timeStamp).getTime()
const getLastDateTimestamp = (list) => new Date(list[0].TimeStamp).getTime()


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


module.exports = {
  byMarketname_BTC,
  byPositiveAverageDailyChange,
  byPositiveLastDailyChange,
  byPositiveLastOrAVGDailyChange,
  byLastAndAVGChangesPositives,
  byPositiveChangeAndLastAboveAVG,
  byASC,
  byDESC,

  getResult,
  getAPISign,
  getURL,
  getProportion,
  getDateTimestamp,
  getLastDateTimestamp,

  toChangeData,
}