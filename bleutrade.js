var stringify     = require("querystring").stringify,
	hmac          = require("crypto").createHmac,
	EventEmitter  = require('events').EventEmitter,
	io 			  = require('socket.io-client')('https://api.bleutrade.com:8083', {secure: true}),
	request       = require("request"),
	util 	      = require("util"),
	publicMethods = ['getmarkets', 'getcurrencies', 'getticker', 'getmarketsummary', 'getmarketsummaries', 'getorderbook', 'getmarkethistory'];

function BleuTradeClient(key, secret, requeue) {
	var self    = this;

	self.key     = key;
	self.secret  = secret;
	self.jar     = request.jar();
	self.requeue = requeue || 0;

	function api_query(method, callback, args) {
		var args_tmp = {};

		for(var i in args) {
			if(args[i]) {
				args_tmp[i] = args[i];
			}
		}

		args = args_tmp;

		var options = {
			uri     : 'https://bleutrade.com/api/v2/' + method,
			agent   : false,
			method  : 'GET',
			jar     : self.jar,
			headers : {
				"User-Agent": "Mozilla/4.0 (compatible; Bleutrade API node client)",
				"Content-type": "application/x-www-form-urlencoded"
			}
		};
		if(publicMethods.indexOf(method) > -1) {
			options.method = 'GET';
			options.uri    = 'https://bleutrade.com/api/v2/public/' + method + '?' + stringify(args);;
		}	else	{
			if (!self.key || !self.secret) {
				throw new Error("Must provide key and secret to make this API request.");
			}	else{
				args.apikey = self.key;
				args.nonce = new Date().getTime();
			 	options.uri += ('?' + stringify(args));
				options.headers.apisign = new hmac("sha512", self.secret).update(options.uri).digest('hex');
			}
		}

		console.log('------------------------------------');
		console.log('api_query options: ', options);
		console.log('------------------------------------');
		request(options, function (err, res, body) {
			if(!body || !res || res.statusCode != 200) {
				var requeue = +self.requeue;

				if(requeue) {
					setTimeout(function() {
						api_query(method, callback, args);
					}, requeue);
				}
				else if(typeof callback === 'function') {
					console.error(err);
					console.error(body);
					callback.call(this, "Error in server response", null);
				}
			} else {
				var error  = null;
				var result = null;

				// console.log('\napi_query err: ', err);
				// console.log('\napi_query res: ', res);
				// console.log('\n\napi_query body: ', body);
				try {
					var response = JSON.parse(body);

					// console.log('\n\napi_query response: ', response);
					if(response.error) {
						error = response.error;
					} else {
						result = response.return || response;
					}
					// console.log('\n\napi_query result: ', result);
				} catch(e) {
					error = "Error parsing server response: " + e.message;
				}
				// console.log('------------------------------------');
				// console.log('NAO CHEGA AUQI PORRA', typeof callback);
				// console.log('------------------------------------');
				if (typeof callback === 'function') {
					// console.log('\n\napi_query callback function result: ', result);
					callback.call(this, error, result);
				}
			}
		});
	}

	// public
	self.getcurrencies = function(callback) {
		api_query('getcurrencies', callback);
	};

	self.getmarkets = function(callback) {
		api_query('getmarkets', callback);
	};

	self.getticker = function(market, callback) {
		api_query('getticker', callback, {market: market});
	};

	self.getmarketsummaries = function(callback) {
		api_query('getmarketsummaries', callback);
	};

	self.getmarketsummary = function(market, callback) {
		api_query('getmarketsummaries', callback, {market: market});
	};

	self.getorderbook = function(market, type, depth, callback) {
		api_query('getorderbook', callback, {market: market, type: type, depth: depth});
	};

	self.getmarkethistory = function(market, count = 200, callback) {
		api_query('getmarkethistory', callback, {market: market, count: count});
	};

	self.getcandles = function(market, period, count, lasthours, callback) {
		api_query('getorderbook', callback, {market: market, period: period, count: count, lasthours: lasthours});
	};

	////////////////////////////////////////////////////////////////////////
	// Private
	////////////////////////////////////////////////////////////////////////

	// Market
	self.market_buylimit = function(market, rate, quantity, comments, callback) {
		api_query('market/buylimit', callback, {market: market, rate: rate, quantity: quantity, comments: comments});
	};

	self.market_selllimit = function(market, rate, quantity, comments, callback) {
		api_query('market/selllimit', callback, {market: market, rate: rate, quantity: quantity, comments: comments});
	};

	self.market_cancel = function(orderid, callback) {
		api_query('market/cancel', callback, {orderid: orderid});
	};

	self.market_getopenorders = function(callback) {
		api_query('market/getopenorders', callback);
	};

	// Account
	self.getbalances = function(currencies, callback) {
		api_query('account/getbalances', callback, { currencies: currencies });
	};

	self.getbalance = function(currency, callback) {
		api_query('account/getbalance', callback, { currency: currency });
	};

	self.getdepositaddress = function(currency, callback) {
		api_query('account/getdepositaddress', callback, { currency: currency });
	};

	self.withdraw = function(currency, quantity, address, callback) {
		api_query('account/withdraw', callback, { currency: currency, quantity: quantity, address: address });
	};

	self.transfer = function(currency, quantity, touser, callback) {
		api_query('account/transfer', callback, { currency: currency, quantity: quantity, touser: touser });
	};

	self.getorder = function(orderid, callback) {
		api_query('account/getorder', callback, { orderid: orderid });
	};

	self.getorders = function(market, orderstatus, callback) {
		api_query('account/getorders', callback, { market: market, orderstatus: orderstatus });
	};

	self.getorderhistory = function(orderid, callback) {
		api_query('account/getorderhistory', callback, { orderid: orderid });
	};

	self.getdeposithistory = function(callback) {
		api_query('account/getdeposithistory', callback);
	};

	self.getwithdrawhistory = function(callback) {
		api_query('account/getwithdrawhistory', callback);
	};

	self.chatsend = function(channel, text, callback) {
		api_query('account/chatsend', callback, {channel: channel, text: text});
	};


	////////////////////////////////////////////////////////////////////////
	// Push API
	////////////////////////////////////////////////////////////////////////
	self.subscribe = function() {
		io.on('message', self.handlePushEvents.bind(this));
	};

	self.handlePushEvents = function(data) {
	  var channel = data[0];
		if(channel === 'Bleutrade_CH1') {
			var msgType = data[1][0];
			self.emit('msgType', data);
		}
	};

}

util.inherits(BleuTradeClient, EventEmitter);

module.exports = BleuTradeClient;
