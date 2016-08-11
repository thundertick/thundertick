module.exports = function(){
	var THUNDERTICK = "fjlfmlponipgmabidmcmijicbbfnbnnj";
	if(navigator.userAgent.toLowerCase().indexOf('firefox') != -1){
		THUNDERTICK = "fjlfmlponipgmabidmcmijicbbfnbnnj@thundertick.com";
	}

	var port = {};

	function connect(){
		
		port = chrome.runtime.connect(THUNDERTICK);
		port.onDisconnect.addListener(function(){
			port.disconnect();
			console.log("DISCONNECTED!!");
			
			setTimeout(function(){
				console.log("RECONNECTING...");
				connect();	
			}, 5000);
		});
	}
	
	connect();
	
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

