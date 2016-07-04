var Fuse = require('fuse.js');

module.exports = {
	regex:/^t(.+|$)/g,
	answerRegex:/tab:(\d+)/,
	tabs: [],
	fuse: null,
	message:"Open tabs",
	onload: function(){
		this.updateTabsCache();
		chrome.tabs.onUpdated.addListener(function(){
			this.updateTabsCache();
		}.bind(this));
	},
	updateTabsCache: function(){
		chrome.tabs.queryAsync({}).then(function(tabs){
			this.tabs = tabs;
			this.fuse = new Fuse(this.tabs, {
				keys:[{name:'url', weight:0.3},{name:'title', weight:0.7}],
				caseSensitive:false,
				tokenize:true
			});
		}.bind(this));
	},
	search: function(query){
		this.query = this.regex.exec(query)[1];
		this.regex.lastIndex = 0;
		return new Promise(function(resolve, reject){
			var searchResults = [];
			var tabs = this.fuse.search(this.query);
			if(!this.query){
				tabs = this.tabs;
			}
			for(i in tabs){
				searchResults.push({
					name:"Opened tab",
					content:"tab:"+tabs[i].id,
					title:tabs[i].title,
					url:tabs[i].url
				});
			}
			resolve(searchResults);
		}.bind(this));
	},
	suggestion: function(suggestion){
		var tabId = this.answerRegex.exec(suggestion)[1];
		this.answerRegex.lastIndex = 0;
		console.log(this.tabs);
		chrome.tabs.update(parseInt(tabId),{
			active:true
		});
		for(var i in this.tabs){
			if(this.tabs[i].id == parseInt(tabId)){
				chrome.windows.update(this.tabs[i].windowId, {
					focused:true
				});
			}
		}
	}
};