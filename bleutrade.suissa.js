const stringify = require("querystring").stringify
const hmac = require("crypto").createHmac
const EventEmitter = require('events').EventEmitter
const io = require('socket.io-client')('https://api.bleutrade.com:8083', {secure: true})
const request = require("request")
const util = require("util")
const publicMethods = ['getmarkets', 'getcurrencies', 'getticker', 'getmarketsummary', 'getmarketsummaries', 'getorderbook', 'getmarkethistory']

const API_URL = 'https://bleutrade.com/api/v2/'
const { API_KEY, API_SECRET } = require('../bleutrade_api')

const axios = require('axios')


// function BleuTradeClient(key, secret, requeue) {
// 	const self    = this;

// 	self.key     = key;
// 	self.secret  = secret;
// 	self.jar     = request.jar();
// 	self.requeue = requeue || 0;

// 	function api_query(method, callback, args) {
// 		const args_tmp = {};

// 		for(const i in args) {
// 			if(args[i]) {
// 				args_tmp[i] = args[i];
// 			}
// 		}

// 		args = args_tmp;

// 		const options = {
// 			uri     : 'https://bleutrade.com/api/v2/' + method,
// 			agent   : false,
// 			method  : 'GET',
// 			jar     : self.jar,
// 			headers : {
// 				"User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
// 				"Content-type": "application/x-www-form-urlencoded"
// 			}
// 		};
// 		if(publicMethods.indexOf(method) > -1) {
// 			options.method = 'GET';
// 			options.uri    = 'https://bleutrade.com/api/v2/public/' + method + '?' + stringify(args);;
// 		}	else	{
// 			if (!self.key || !self.secret) {
// 				throw new Error("Must provide key and secret to make this API request.");
// 			}	else{
// 				args.apikey = self.key;
// 				args.nonce = new Date().getTime();
// 			 	options.uri += ('?' + stringify(args));
// 				options.headers.apisign = new hmac("sha512", self.secret).update(options.uri).digest('hex');
// 			}
// 		}

// 		request(options, function (err, res, body) {
// 			if(!body || !res || res.statusCode != 200) {
// 				const requeue = +self.requeue;

// 				if(requeue) {
// 					setTimeout(function() {
// 						api_query(method, callback, args);
// 					}, requeue);
// 				}
// 				else if(typeof callback === 'function') {
// 					console.error(err);
// 					console.error(body);
// 					callback.call(this, "Error in server response", null);
// 				}
// 			} else {
// 				const error  = null;
// 				const result = null;

// 				try {
// 					const response = JSON.parse(body);

// 					if(response.error) {
// 						error = response.error;
// 					} else {
// 						result = response.return || response;
// 					}
// 				} catch(e) {
// 					error = "Error parsing server response: " + e.message;
// 				}
// 				if (typeof callback === 'function') {
// 					callback.call(this, error, result);
// 				}
// 			}
// 		});
// 	}

// 	// public
// 	self.getcurrencies = function(callback) {
//     // actions.getcurrencies()
// 		api_query('getcurrencies', callback);
// 	};


// 	self.getmarkets = function(callback) {
// 		api_query('getmarkets', callback);
// 	};


// 	self.getticker = function(market, callback) {
// 		api_query('getticker', callback, {market: market});
//   };

// 	self.getmarketsummaries = function(callback) {
// 		api_query('getmarketsummaries', callback);
// 	};

// 	self.getmarketsummary = function(market, callback) {
// 		api_query('getmarketsummaries', callback, {market: market});
//   };


// 	self.getorderbook = function(market, type, depth, callback) {
// 		api_query('getorderbook', callback, {market: market, type: type, depth: depth});
// 	};

// 	self.getmarkethistory = function(market, count, callback) {
// 		api_query('getmarkethistory', callback, {market: market, count: count});
// 	};

// 	self.getcandles = function(market, period, count, lasthours, callback) {
// 		api_query('getorderbook', callback, {market: market, period: period, count: count, lasthours: lasthours});
// 	};

// 	////////////////////////////////////////////////////////////////////////
// 	// Private
// 	////////////////////////////////////////////////////////////////////////

// 	// Market
// 	self.market_buylimit = function(market, rate, quantity, comments, callback) {
// 		api_query('market/buylimit', callback, {market: market, rate: rate, quantity: quantity, comments: comments});
// 	};

// 	self.market_selllimit = function(market, rate, quantity, comments, callback) {
// 		api_query('market/selllimit', callback, {market: market, rate: rate, quantity: quantity, comments: comments});
// 	};

// 	self.market_cancel = function(orderid, callback) {
// 		api_query('market/cancel', callback, {orderid: orderid});
// 	};

// 	self.market_getopenorders = function(callback) {
// 		api_query('market/getopenorders', callback);
// 	};

// 	// Account
// 	self.getbalances = function(currencies, callback) {
// 		api_query('account/getbalances', callback, { currencies: currencies });
// 	};

// 	self.getbalance = function(currency, callback) {
// 		api_query('account/getbalance', callback, { currency: currency });
// 	};

// 	self.getdepositaddress = function(currency, callback) {
// 		api_query('account/getdepositaddress', callback, { currency: currency });
// 	};

// 	self.withdraw = function(currency, quantity, address, callback) {
// 		api_query('account/withdraw', callback, { currency: currency, quantity: quantity, address: address });
// 	};

// 	self.transfer = function(currency, quantity, touser, callback) {
// 		api_query('account/transfer', callback, { currency: currency, quantity: quantity, touser: touser });
// 	};

// 	self.getorder = function(orderid, callback) {
// 		api_query('account/getorder', callback, { orderid: orderid });
// 	};

// 	self.getorders = function(market, orderstatus, callback) {
// 		api_query('account/getorders', callback, { market: market, orderstatus: orderstatus });
// 	};

// 	self.getorderhistory = function(orderid, callback) {
// 		api_query('account/getorderhistory', callback, { orderid: orderid });
// 	};

// 	self.getdeposithistory = function(callback) {
// 		api_query('account/getdeposithistory', callback);
// 	};

// 	self.getwithdrawhistory = function(callback) {
// 		api_query('account/getwithdrawhistory', callback);
// 	};

// 	self.chatsend = function(channel, text, callback) {
// 		api_query('account/chatsend', callback, {channel: channel, text: text});
// 	};


// 	////////////////////////////////////////////////////////////////////////
// 	// Push API
// 	////////////////////////////////////////////////////////////////////////
// 	self.subscribe = function() {
// 		io.on('message', self.handlePushEvents.bind(this));
// 	};

// 	self.handlePushEvents = function(data) {
// 	  const channel = data[0];
// 		if(channel === 'Bleutrade_CH1') {
// 			const msgType = data[1][0];
// 			self.emit('msgType', data);
// 		}
// 	};

// }

// util.inherits(BleuTradeClient, EventEmitter);


const getOptionsPublic = (action, params = {}, data = {}) => ({
  url: 'https://bleutrade.com/api/v2/public/' + action,
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

const getOptionsMarket = (action, params = {}, data = {}) => ({
  url: 'https://bleutrade.com/api/v2/market/' 
    + action + '?apikey=' + params.apikey + '&nonce=' + params.nonce,
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

const getURL = (action, params) => //API_URL + action + '?' + stringify(params)
  console.log(API_URL + action + '?' + stringify(params))

const getOptionsAccount = (action, params = {}, data = {}) => ({
  // url: getURL(action, params),
  url: 'https://bleutrade.com/api/v2/account/'
    + action + '?apikey=' + params.apikey + '&nonce=' + params.nonce
    + '&currency=' + params.currency,
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

const getOptionsOrdersAccount = (action, params = {}, data = {}) => ({
  // url: getURL(action, params),
  url: 'https://bleutrade.com/api/v2/account/'
    + action + 
    '?apikey=' + params.apikey + 
    '&nonce=' + params.nonce + 
    '&market=' + params.config.market +
    '&orderstatus=' + params.config.orderstatus +
    '&ordertype=' + params.config.ordertype,
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

const getResult = (result) =>
  (result.data.success === 'true') ? result.data.result : []


const getAPISign = (options, apisecret) => {
  options.headers.apisign = new hmac("sha512", apisecret)
                                    .update(options.url)
                                    .digest('hex')

  return options
}

const actions = {
  getcurrencies: async (args = {}) =>
    getResult(await axios(getOptionsPublic('getcurrencies', args))),

  getmarkets: async (args = {}) =>
    getResult(await axios(getOptionsPublic('getmarkets', args))),

  getticker: async (market = 'HTML_BTC') =>
    getResult(await axios(getOptionsPublic('getticker', { market }, {}))),

  getmarketsummaries: async () =>
    getResult(await axios(getOptionsPublic('getmarketsummaries'))),

  getmarketsummary: async (market = 'HTML_BTC') =>
    getResult(await axios(getOptionsPublic('getmarketsummary', { market }, {}))),

//

  getopenorders: async () =>
    getResult(
      await axios(
        getAPISign(
          getOptionsMarket( 'getopenorders', 
                            { apikey: API_KEY, nonce: Date.now() }
                          ), 
          API_SECRET ))),

  getbalances: async (currencies = '') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getbalances',
            { apikey: API_KEY, nonce: Date.now(), currencies }
          ),
          API_SECRET))),

  getbalance: async (currency = 'HTML') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getbalance',
            { apikey: API_KEY, nonce: Date.now(), currency }
          ),
          API_SECRET))),

  getdepositaddress: async (currency = 'HTML') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getdepositaddress',
            { apikey: API_KEY, nonce: Date.now(), currency }
          ),
          API_SECRET))),

  getorder: async (orderid = '76678139') =>
    getResult(
      await axios(
        getAPISign(
          getOptionsAccount('getorder',
            { apikey: API_KEY, nonce: Date.now(), orderid }
          ),
          API_SECRET))),

  getorders: async (config) => 
    getResult(
      await axios(
        getAPISign(
          getOptionsOrdersAccount('getorders',
            { apikey: API_KEY, nonce: Date.now(), config }
          ),
          API_SECRET))),

          
}

// const ACTIONS = {}


// ACTIONS.getcurrencies = () => //console.log('self.getcurrenciesPromise')
//   actions.getcurrencies()

// ACTIONS.getmarkets = () => //console.log('self.getcurrenciesPromise')
//   actions.getmarkets()

// ACTIONS.getticker = (args) => //console.log('self.getcurrenciesPromise')
//   actions.getticker(args)

// ACTIONS.getmarketsummaries = (args) => //console.log('self.getcurrenciesPromise')
//   actions.getmarketsummaries(args)

// ACTIONS.getmarketsummary = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getmarketsummary(args)

// // market
// ACTIONS.getopenorders = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getopenorders(args)

// // account
// ACTIONS.getbalances = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getbalances(args)

// ACTIONS.getbalance = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getbalance(args)

// ACTIONS.getdepositaddress = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getdepositaddress(args)

// ACTIONS.getorder = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getorder(args)

// ACTIONS.getorders = (args) => //console.log('self.getmarketsummaryPromise', args)
//   actions.getorders(args)




const Bleutrade = (key, secret, requeue = 0) => {
  const config = {}

  config.key = key
  config.secret = secret
  // config.jar = request.jar();
  config.requeue = requeue


  return actions
}

module.exports = Bleutrade;
