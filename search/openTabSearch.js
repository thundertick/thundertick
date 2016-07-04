module.exports = {
	regex:/^find\s([0-9A-Za-z\s]+)/g,
	answerRegex:/tab-found:(\d+)/,
	message:"Find text",
	onload: function(){

	},
	updateTabsCache: function(){

	},
	search: function(query){
		var searchQuery = this.regex.exec(query)[1];
		console.log(searchQuery);
		this.regex.lastIndex = 0;
		return new Promise(function(resolve, reject){
			chrome.tabs.queryAsync({})
			.then(function(tabs){
				var searchPromises = tabs.map(function(item){
					return chrome.tabs.executeScriptAsync(item.id,{
						code:"find('"+ this + "', false, undefined, true, false, false, true)",	
						runAt:"document_end"
					}).then(function(result){
						return {tab:this, result:result[0]};
					}.bind(item))
					.catch(function(result){
						return {tab:this, result:undefined}
					}.bind(item));
				}.bind(searchQuery));
				Promise.all(searchPromises).then(function(found){
					var searchResults = [];
					for(i in found){
						if(found[i].result)
						searchResults.push({
							name:"Text find",
							content:"tab-found:"+found[i].tab.id,
							title: found[i].tab.title, 
							url: found[i].tab.url
						});
					}
					console.log(searchResults);
					this(searchResults);
				}.bind(this));
			}.bind(resolve));
		});
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