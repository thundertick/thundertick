var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "" && query.trim().length < 2)
			return false;
		return fuzzy.test(query, 'screenshot');
	},
	browsers:["chrome"],
	answerRegex:/^screenshot/,
	message:"Screenshot",
	doc:{
		type:'command',
		keyword:'screenshot',
		info:'Command to take a screenshot of the current page'
	},
	onload: function(){

	},
	search: function(query){
		return Promise.resolve([
			{
				name:"Screenshot",
				content:"screenshot",
				title:"Screenshot",
				url:"Takes a screenshot of the currently active tab and lets you save it."
			}
		]);
	},
	suggestion: function(suggestion){
		setTimeout(function(){
			chrome.tabs.captureVisibleTab({
				format:"png",	
			}, function(dataurl){
				//chrome.tabs.create({url:dataurl, active:true});
				chrome.downloads.download({
					url:dataurl,
					filename:"screenshot.png",
					saveAs:true
				})
			});
		}, 800);
	}
};