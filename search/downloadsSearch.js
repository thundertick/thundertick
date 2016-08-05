module.exports = {
	regex:/^d($|.+)/g,
	answerRegex:/download:(\d+)/,
	message:"Downloads",
	doc:{
		type:'search',
		keyword:'d',
		info:'Keyword followed by your query to search your downloads'
	},
	search: function(query){
		this.query = this.regex.exec(query)[1];
		this.regex.lastIndex = 0;
		return new Promise(function(resolve, reject){
			chrome.downloads.searchAsync({
				query:[this.query],
				orderBy:['-startTime'],
				limit:10
			})
			.then(function(downloads){
				downloads = downloads.map(function(download){
					return {
						name:(download.state == "complete")? "Download completed":"Download in progress",
						content:"download:"+download.id,
						title:download.filename,
						url:download.url
					};
				});
				resolve(downloads);
			});
		}.bind(this));
	},
	suggestion: function(suggestion){
		var downloadId = this.answerRegex.exec(suggestion)[1];
		this.answerRegex.lastIndex = 0;
		chrome.downloads.show(parseInt(downloadId));
	}
};