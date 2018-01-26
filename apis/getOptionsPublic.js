const getOptionsPublic = (config) => (action, params = {}, data = {}) => ({
  url: config.API_URL + 'public/' + action,
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

module.exports = getOptionsPublic