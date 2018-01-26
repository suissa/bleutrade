var util = require('util');

const BleutradeAPI = require('./bleutrade.suissa')
const { API_KEY, API_SECRET } = require('../bleutrade_api')
const bleutrade = BleutradeAPI(API_KEY, API_SECRET)

const isActive = (obj) => obj.IsActive === 'true'
const calcChange = (low, high) => Number(((high * 100) / low) * 0.1).toFixed(2)
const byBTCpair = (obj) => obj.BaseCurrency = 'Bitcoin'
const getPositiveChange = (obj) => (obj.High > obj.Low)
const byMarketname_BTC = (obj) => obj.MarketName.endsWith('_BTC')
const byMarketnameHTML_ = (obj) => obj.MarketName.startsWith('HTML_')

const toChange = (obj) => {

  const _obj = {}

  _obj.MarketName = obj.MarketName
  _obj.PrevDay = obj.PrevDay
  _obj.High = obj.High
  _obj.Low = obj.Low
  _obj.Last = obj.Last
  _obj.Average = obj.Average
  _obj.Bid = obj.Bid
  _obj.Ask = obj.Ask

  _obj.change = calcChange(_obj.Low, _obj.High)
  return _obj
}

const API = 'bonus'
const ACTION = 'getPriceChange'

;(async () => {
  try {
    const data = '84719493'
    const html = 'HTML'
    // const params = {
    //   market: 'HTML_BTC', // DIVIDEND_DIVISOR or ALL
    //   orderstatus: 'ALL', // ALL, OK, OPEN, CANCELED
    //   ordertype: 'ALL', // ALL, BUY, SELL
    //   // depth: , // optional, default is 500, max is 20000
    // }
    const params2 = {
      market: 'HTML_BTC', 
      rate: 0.00000200, 
      quantity: 1000, 
      // comments: , 
    }
    const params3 = {
      market: 'HTML_BTC',
      period: '30m',
      count: 1000,
      lasthours: 48,
    }

    const market = 'DOGE_BTC'
    const result = await bleutrade[API][ACTION](params3.market, 120)

    console.log('------------------------------------');
    console.log(ACTION + ' result: ', result);

    // console.log('getPriceChange1Hour result: ', 
    //   await bleutrade[API].getPriceChange1Hour(market));

    // console.log('getPriceChange12Hours result: ',
    //   await bleutrade[API].getPriceChange12Hours(params3.market));

    // console.log('getPriceChange1Week result: ',
    //   await bleutrade[API].getPriceChange1Week(market));
    // console.log(' result: ', result);
    // console.log(' result: ', result);
    console.log('------------------------------------');
  } catch (error) {
    throw new Error(error.stack)
  }
})()
