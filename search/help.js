var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "")
			return false;
		return fuzzy.test(query, 'help');
	},
	answerRegex:/help/,
	message:"Help",
	browsers:["chrome","firefox"],
	doc:{
		type:'command',
		keyword:'help',
		info:'Open help page'
	},
	lastTabId:0,
	newTabId:0,
	search: function(query){
		return Promise.resolve([
		{
			name:"Help",
			content:"help",
			title:"Opens the thundertick command cheatsheet",
			url:"A list of all the commands available in thundertick"
		}
		]);
	},
	suggestion: function(suggestion){
		chrome.tabs.create({url:'./pages/help/index.html', active:true});
	}
};