module.exports = {
	regex:/^r(?:[efresh\sall]*)/,
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
		chrome.tabs.queryAsync({})
		.then(function(tabs){
			for(var i in tabs){
				var tab = tabs[i];
				chrome.tabs.reload(tab.id, {bypassCache:true});
			}
		})
	}
};