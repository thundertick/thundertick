require('../styles/help.scss');


var port = chrome.runtime.connect();

port.onMessage.addListener(function(req){
	if(req.type !='doc-results'){
		return;
	}
	var results = req.body.results;
	for(var i in results){
		var template = `
				<div class = "key-container"><div class = "key">${results[i].keyword}</div></div>
				<span class = "info">${results[i].info}</span>
		`;
		var div = document.createElement('div');
		div.className = 'command';
		div.innerHTML = template;
		if(results[i].type == "search"){
			document.getElementById('search-container').appendChild(div);
		}
		if(results[i].type == "command"){
			document.getElementById('command-container').appendChild(div);
		}
	}
});

port.postMessage({type:"get-docs"});