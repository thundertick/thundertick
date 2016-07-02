var utils = require('../libs/utils.js');

module.exports = {
	regex:/^h(.+|$)/g,
	answerRegex:/history:(.+)/,
	tabs: [],
	fuse: null,
	message:"Searching your browser history",
	onload: function(){

	},
	search: function(query){
		this.query = this.regex.exec(query)[1];
		this.regex.lastIndex = 0;
		if(!this.query)
			this.query = "";
		return new Promise(function(resolve, reject){
			chrome.history.searchAsync({text:this.query, maxResults: 5})
			.then(function(results){
				var searchResults = [];
				for(i in results){
					searchResults.push({
						name:"History",
						content:"history:"+results[i].url,
						title:results[i].title,
						url:results[i].url
					});
				}
				resolve(searchResults);
			});
		}.bind(this));
	},
	suggestion: function(suggestion){
		var url = this.answerRegex.exec(suggestion)[1];
		this.answerRegex.lastIndex = 0;
		chrome.tabs.create({url:url, active:true});
	}
};