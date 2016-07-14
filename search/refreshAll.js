var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "")
			return false;
		return fuzzy.test(query, 'refresh all');
	},
	answerRegex:/refresh-all/,
	message:"Refresh All",
	onload: function(){

	},
	search: function(query){
		return Promise.resolve([
			{
				name:"Refresh All",
				content:"refresh-all",
				title:"Refresh all tabs"
			}
		]);
	},
	suggestion: function(suggestion){
		chrome.tabs.queryAsync({windowType:"normal"})
		.then(function(tabs){
			for(var i in tabs){
				var tab = tabs[i];
				if(tab.url.indexOf("chrome://")!=-1){
					continue;
				}
				chrome.tabs.reload(tab.id, {bypassCache:true});
			}
		})
	}
};