var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "")
			return false;
		return fuzzy.test(query, 'switch to last active tab');
	},
	answerRegex:/stla/,
	message:"Switch to last tab",
	lastTabId:0,
	newTabId:0,
	onload: function(){
		chrome.tabs.onActivated.addListener(function(changeObj){
			this.lastTabId = this.newTabId;
			this.newTabId = changeObj.tabId;
		}.bind(this));

		chrome.tabs.queryAsync({active:true})
		.then(function(tabs){
			console.log(tabs);
			this.lastTabId = tabs[0].id;
			this.newTabId = tabs[0].id;
		}.bind(this));
	},
	search: function(query){
		return Promise.resolve([
		{
			name:"Switch to last tab",
			content:"stla",
			title:"Switch to last active tab",
			url:"Switches to the last active tab"
		}
		]);
	},
	suggestion: function(suggestion){
		chrome.tabs.update(this.lastTabId, {active:true});
	}
};