var groupby = require('lodash.groupby');

module.exports = {
	regex:/^s(?:[ort\stabs]*)/,
	answerRegex:/sort-tabs/,
	message:"Sort Tabs",
	onload: function(){

	},
	search: function(query){
		return Promise.resolve([
			{
				name:"Sort Tabs",
				content:"sort-tabs",
				title:"Sort all tabs by URL"
			}
		]);
	},
	suggestion: function(suggestion){
		chrome.tabs.queryAsync({})
		.then(function(tabs){
			var grouped = groupby(tabs, function(tab){
				var base = tab.url.match(/^https?:\/\/[^\/]+/i);
				if(!base)
					return "unknown";
				else
					return base[0];
			});
			var keys = Object.keys(grouped)
			for(var i in keys){
				var key = keys[i];
				for(var j in grouped[key]){
					var tab = grouped[key][j];
					chrome.tabs.move(tab.id, {index:-1});
				}
			}
		});
	}
};