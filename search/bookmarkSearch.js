module.exports = {
	regex:/^b(.+)/g,
	answerRegex:/bookmark:(\d+)/,
	message:"Bookmarks",
	search: function(query){
		this.query = this.regex.exec(query)[1];
		this.regex.lastIndex = 0;
		return new Promise(function(resolve, reject){
			chrome.bookmarks.searchAsync(this.query)
			.then(function(bookmarks){
				bookmarks = bookmarks.filter(function(bookmark){
					return !bookmark.dateGroupModified;
				});
				bookmarks = bookmarks.map(function(bookmark){
					return {
						name:"Bookmark",
						content:"bookmark:"+bookmark.id,
						title:bookmark.title,
						url:bookmark.url
					}
				});
				resolve(bookmarks);
			});
		}.bind(this));
	},
	suggestion: function(suggestion){
		var bookmarkId = this.answerRegex.exec(suggestion)[1];
		this.answerRegex.lastIndex = 0;
		chrome.bookmarks.getAsync(bookmarkId)
		.then(function(bookmarks){
			chrome.tabs.create({url:bookmarks[0].url, active:true});
		});
	}
};