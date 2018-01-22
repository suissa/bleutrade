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

const ACTION = 'getorders'

;(async () => {
  try {
    const action = ACTION + 'Promise'
    const data = 'HTML'
    const params = {
      market: 'HTML_BTC', // DIVIDEND_DIVISOR or ALL
      orderstatus: 'ALL', // ALL, OK, OPEN, CANCELED
      ordertype: 'ALL', // ALL, BUY, SELL
      // depth: , // optional, default is 500, max is 20000
    }
    const result = await bleutrade[ACTION](params)

    console.log('------------------------------------');
    console.log(action+' result: ', result);
    console.log('------------------------------------');
  } catch (error) {
    throw new Error(error)
  }
})()
