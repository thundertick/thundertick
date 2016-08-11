var groupby = require('lodash.groupby');
var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "" && query.trim().length < 2)
			return false;
		return fuzzy.test(query, 'sort tabs');
	},
	answerRegex:/sort-tabs/,
	message:"Sort Tabs",
	browsers:["chrome","firefox"],
	doc:{
		type:'command',
		keyword:'sort tabs',
		info:'Command to sort all tabs by URL'
	},
	onload: function(){

	},
	search: function(query){
		return Promise.resolve([
			{
				name:"Sort Tabs",
				content:"sort-tabs",
				title:"Sort all tabs by URL",
				url:"Sorts all your tabs based on their web addresses"
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