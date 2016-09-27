var fuzzy = require('fuzzyjs');
module.exports = {
	regex:function(query){
		if(query.trim() == "")
			return false;
		return fuzzy.test(query, 'facebook share');
	},
	answerRegex:/^share:(.+)/,
	message:"Facebook Share",
	browsers:["chrome","firefox"],
	doc:{
		type:'command',
		keyword:'share',
		info:'Shares current tab on facebook'
	},
	search: function(query){
		return new Promise(function(resolve, reject){
			chrome.tabs.query({active:true}, function(tabs){
				resolve([{
					name:"Share on facebook",
					content:"share:"+tabs[0].url.slice(),
					title:tabs[0].title.slice(),
					url:tabs[0].url.slice()
				}]);
			});
		});
	},
	suggestion: function(suggestion){
		var shareUrl = this.answerRegex.exec(suggestion)[1];
		console.log(shareUrl);
		chrome.windows.create({
			url:"https://www.facebook.com/sharer.php?u="+encodeURIComponent(shareUrl),
			width:600,
			height:500,
			focused:true,
			type:"detached_panel"
		});
	}
};