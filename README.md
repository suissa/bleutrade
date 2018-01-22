# BleuTrade-API
NodeJS Client Library for the BleuTrade Exchange (BleuTrade.com) API

Very much based on the work of https://github.com/nothingisdead/npm-cryptsy-api

It exposes all the API methods found here: https://bleutrade.com/help/API

Example Usage:

```javascript
var util = require('util');

var BleutradeAPI = require('bleutrade-api');
var bleutrade = new BleutradeAPI("YOUR-KEY-FOR-PRIVATE-FUNCTIONS", "YOUR-SECRET-FOR-PRIVATE-FUNCTIONS");

bleutrade.getmarketsummaries(function(err, summaries) {
	if(err) return;

	if(summaries.success) {
		summaries.result.forEach(function(market) {
			console.log(util.format("%s: %d Low %d High %d Volume", market.MarketName, market.Low, market.High, market.Volume));
		})
	}
});
```