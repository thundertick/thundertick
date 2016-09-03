var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "")
			return false;
		return fuzzy.test(query, 'settings');
	},
	answerRegex:/settings/,
	message:"Settings",
	browsers:["chrome","firefox"],
	doc:{
		type:'command',
		keyword:'Settings',
		info:'Open Thundertick Settings page'
	},
	lastTabId:0,
	newTabId:0,
	search: function(query){
		return Promise.resolve([
		{
			name:"Settings",
			content:"settings",
			title:"Opens the thundertick settings",
			url:"Change various thundertick settings like the hotkey."
		}
		]);
	},
	suggestion: function(suggestion){
		chrome.tabs.create({url:'./pages/settings/index.html', active:true});
	}
};