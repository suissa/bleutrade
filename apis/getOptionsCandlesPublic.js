const getOptionsCandlesPublic = (config) => (action, params = {}, data = {}) => ({
  url: config.API_URL + 'public/' + action
    + (() => (params.market) ? '?market=' + params.market : '')()
    + (() => (params.period) ? '&period=' + params.period : '')()
    + (() => (params.count) ? '&count=' + params.count : '')()
    + (() => (params.lasthours) ? '&lasthours=' + params.lasthours : '')(),
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

module.exports = getOptionsCandlesPublic

