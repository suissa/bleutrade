const getOptionsSellMarket = (config) => (action, params = {}, data = {}) => ({
  url: config.API_URL + 'market/'
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

module.exports = getOptionsSellMarket

