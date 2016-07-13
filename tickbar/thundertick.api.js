module.exports = function(){
	const THUNDERTICK = "flgjiafbioledndgpeamhfoipgldgmca";
	var port = chrome.runtime.connect(THUNDERTICK);
	
	this.search = function(query, cb){
		onMessage = function(message){
			port.onMessage.removeListener(onMessage);
			if(message.type == "search-results"){
				cb(message.body.results);
			}
		}
		port.onMessage.addListener(onMessage);

		port.postMessage({
			type:"search",
			body: {
				query:query
			}
		});
	}

	this.select = function(query){
		port.postMessage({
			type:'select-result',
			body:{
				query:query
			}
		});
	}
	this.port = port;

	return this;

}

