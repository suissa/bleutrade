const getOptionsAccount = (config) => (action, params = {}, data = {}) => ({
  // url: getURL(action, params),
  url: config.API_URL + 'account/'
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

module.exports = getOptionsAccount

