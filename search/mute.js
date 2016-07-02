module.exports = {
	regex:/^mute|^unmute/g,
	answerRegex:/^mute:(.+)/,
	message:"Muting/unmuting tabs",
	onload: function(){

	},
	search: function(query){
		this.query = this.regex.exec(query)[1];
		this.regex.lastIndex = 0;
		return new Promise(function(resolve, reject){
			chrome.tabs.queryAsync({'audible':true})
			.then(function(tabs){
				var searchResults = [];
				for(var i in tabs){
					var name = (tabs[i].mutedInfo.muted?"Unmute Tab":"Mute Tab");
					searchResults.push({
						name:name,
						content:"mute:"+tabs[i].id,
						title:tabs[i].title,
						url:tabs[i].url
					});
				}
				resolve(searchResults);
			});
		}.bind(this));
	},
	suggestion: function(suggestion){
		var tabId = this.answerRegex.exec(suggestion)[1];
		this.answerRegex.lastIndex = 0;
		chrome.tabs.getAsync(parseInt(tabId))
		.then(function(tab){
			chrome.tabs.update(tab.id,{
				muted:!tab.mutedInfo.muted
			});
		});
	}
};