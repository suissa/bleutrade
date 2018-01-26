const MINUTES_IN_MS = 60000
const actions = {
  public: require('../../apis/public'),
  market: require('../../apis/market'),
  account: require('../../apis/account'),
}
// console.log('------------------------------------');
// console.log(actions);
// console.log('------------------------------------');
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

const getDateTimestamp = (timeStamp) => new Date(timeStamp).getTime()
const getLastDateTimestamp = (list) => new Date(list[0].TimeStamp).getTime()


const byPriceChange = (obj) => {

}
// const getPriceChange = async (market = 'HTML_BTC', period = 60) => {
//   const history = await actions.public.getmarkethistory(market, period)

//   const start = getLastDateTimestamp(history)

//   const list = history.filter(byPriceChange)
//   console.log('------------------------------------');
//   // console.log('history: ', history);
//   console.log('start: ', start);
//   console.log('------------------------------------');
//   // return history
// }

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
    const res = await actions.public.getmarketsummaries()

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

const ifIsInPeriod = (start, period) => (obj) =>{
  const end = start - period
  const curDate = getDateTimestamp(obj.TimeStamp)
  // console.log('------------------------------------');
  // console.log(start, end, curDate);
  // console.log('------------------------------------');
  return (curDate >= end)

}

const getPriceChange = async (market = 'HTML_BTC', period = 60) => {
  try {
    const res = await actions.public.getmarkethistory(market, period)

    const startObj = res[0]
    // const start = getLastDateTimestamp(res)
    const start = getDateTimestamp(startObj.TimeStamp)
    // const _period = 
    const result = res.filter(ifIsInPeriod(start, period * MINUTES_IN_MS))

    const endObj = result.reverse()[0]

    const change = getChange(Number(endObj.Price), Number(startObj.Price)) 
    // console.log('------------------------------------');
    // console.log('res: ', res[0], res[1]);
    console.log('startObj: ', startObj);
    console.log('endObj: ', endObj);
    console.log('change: ', change);
    // console.log('------------------------------------');
    // return result
  } catch (error) {
    throw new Error(error.stack)
  }
}


// const getPositiveChangeAndLastAboveAVG = async () => {
//   try {
//     const res = await moreVolatile()

//     const result = res.filter(byPositiveChangeAndLastAboveAVG)
//     return result
//   } catch (error) {
//     throw new Error(error.stack)
//   }

// }

(async () => {
  const fn = getPriceChange
  console.log('getPriceChange: ', await fn())
})()


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
    "OrderType": "SELL",
    "TimeStamp": "2014-07-29 18:09:35",
    "Quantity": 120.00000000,
    "Price": 0.00029,
    "Total": 0.360234432,
    "OrderType": "BUY"
  // }, {
    // "TimeStamp": "2014-07-29 18:10:05",
    // "Quantity": 120.00000000,
    // "Price": 0.00040,
    // "Total": 0.360234432,
    // "OrderType": "BUY"
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

const isInPeriod = (start, end, time) => (time <= start && time >= end)
const toWrapperCandles = (candleTime) => (arr, cur, i, list) => {
  const minute = 60000
  const candlePeriod = candleTime * minute
  const start = new Date(list[0].TimeStamp).getTime()

  const time = new Date(cur.TimeStamp).getTime()
  const end = start - candlePeriod

  const isIn = isInPeriod(start, end , time)
  // 1406668175000 1406668115000 1406668125000
  console.log('------------------------------------');
  console.log('isIn: ', isIn, start, end, time, cur);
  console.log('------------------------------------');

  // const arr = []
  if (isInPeriod(start, end, time)) {
    arr.push(cur)
    
  }

  return arr
}

const getCandles = (listCandle) => {
// ({ market = 'HTML_BTC', size = 1, count = 1000, period = 24 }) => {
  const list = listCandle.reverse() // precisa vir do mais atual para omais antigo
  const candleSize = 1

  console.log('list: ', list);
  const list2 = list.reduce(toWrapperCandles(candleSize))
  console.log('list2: ', list2);
  // const candles = list2.map((candle) => candle.reduce(toCandle, {}))
  // const candles = list.reduce(toCandle(candleSize), {})
  // const candles = list.reduce(toCandle, {})
  // console.log('------------------------------------');
  // console.log('candles: ', candles);
  // console.log('------------------------------------');

  // return candles
}



const sum = (x, y) => x + y
const minus = (x, y) => x - y
const divide = (x, y) => x / y
const avg = (...list) => divide(list.reduce(sum, 0), list.length)
const decimals = (decimal) => (x) => Number(Number(x).toFixed(decimal))

const toRS = (obj, cur, i) => {
  if (!i) {
    obj.High = 0
    obj.Low = 0
  }

  obj.High = (cur.Type === 'green') ? obj.High + 1 : obj.High
  obj.Low = (cur.Type === 'red') ? obj.Low + 1 : obj.Low

  return obj
}
const RS = (list = [], period = 1) => {

  console.log('------------------------------------');
  console.log('RS list: ', list);
  const AVG = list.reduce(toRS, {})

  console.log('------------------------------------');
  console.log('RS: ', AVG);
  console.log('------------------------------------');

  return AVG
}
const RSI = (list, period) => minus(100, (100 / (1 + RS([list], period))))

module.exports = {
  moreVolatile,
  getCandles,
  getPositiveChangeAndLastAboveAVG,
  getPriceChange
}

// const with2decimals = decimals(2)
// avg(2, 2, 3, 3, 10, 10, 10)
// with2decimals(avg(2,2,3,3,10,10,10))

// RSI = 100 – 100 / (1 + RS *)

//   * RS = Média de X dias de alta / Média de X dias de baixa.

// A quantidade de períodos padrão é 14, sendo que 9 e 28 também são comumente utilizados.Geralmente, mais períodos tendem a gerar dados mais precisos.
