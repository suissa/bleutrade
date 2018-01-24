const BleutradeAPI = require('./bleutrade')

const { API_KEY, API_SECRET } = require('../bleutrade_api')
const bleutrade = new BleutradeAPI(API_KEY, API_SECRET)
console.log('------------------------------------');
console.log(bleutrade);
console.log('------------------------------------');

const market = 'HTML_BTC'
const period = '30m'
const count = 1000
const lasthours = 48

const callback = (err, result) => {
  if (err) throw new Error(err)

  console.log('------------------------------------');
  console.log('result: ', result);
  console.log('------------------------------------');
}

bleutrade.getcandles(market, period, count, lasthours, callback)