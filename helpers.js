const hmac = require("crypto").createHmac
const stringify = require("querystring").stringify

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

module.exports = {
  getResult,
  getAPISign,
  getURL
}