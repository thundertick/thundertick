module.exports = {
	regex:/^\/(.+)/g,
	answerRegex:/(google|wiki):(.+)/,
	message:"Web Search",
	doc:{
		type:'search',
		keyword:'/',
		info:'Keyword followed by your query to search the web'
	},
	onload: function(){

	},
	search: function(query){
		this.query = this.regex.exec(query)[1];
		this.regex.lastIndex = 0;
		return Promise.resolve([
			{
				name:"Google Search",
				content:"google:"+this.query,
				title:"Search Google for " + this.query
			},
			{
				name:"Wiki Search",
				content:"wiki:"+this.query,
				title:"Search Wikipedia for " + this.query
			}
		]);
	},
	suggestion: function(suggestion){
		var query = this.answerRegex.exec(suggestion);
		var engine = query[1];
		query = query[2];
		this.regex.lastIndex = 0;
		if(engine == "google"){
			chrome.tabs.create({url:"https://www.google.com.sg/search?q="+encodeURIComponent(query), active:true});
		}
		if(engine == "wiki"){
			chrome.tabs.create({url:"https://en.wikipedia.org/wiki/Special:Search?search="+encodeURIComponent(query), active:true});
		}
	}
};