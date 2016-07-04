searchEngines = [
	require('./search/tabSearch.js'), 
	require('./search/openTabSearch.js'),
	require('./search/historySearch.js'),
	require('./search/mute.js')
];
var utils = require('./libs/utils.js');
var overlayManager = require('./overlay/overlayManager.js')();
var API = require('./api.js');

chrome.omnibox.setDefaultSuggestion({
	description:"Omnibox+"
});

window.onload = function(){
	console.log("preparing...");
	utils.promisifyChromeTabs();
	utils.promisifyChromeHistory();
	for(var i in searchEngines){
		if(searchEngines[i].onload){
			searchEngines[i].onload();
		}
	}
}


var triggerSearch = function(text, suggest){
	var searchFunctions = [];
	for(var i in searchEngines){
		var searchEngine = searchEngines[i];
		if(searchEngine.enabled == false){
			continue;
		}
		if(!Array.isArray(searchEngine.regex)){
			if(text.match(searchEngine.regex) != null){
				if(searchEngine.message)
					overlayManager.changeMessage(searchEngine.message);
				else
					overlayManager.changeMessage("Thundertick");
				searchFunctions.push(searchEngine.search(text));
			}
		} else {
			for(i in searchEngine.regex){
				if(text.match(searchEngine.regex[i]) != null){
					searchFunctions.push(searchEngine.search(text));
					break;
				}
			}
		}
	}
	Promise.all(searchFunctions).then(function(results){
		var allResults = [];
		for(var i in results){
			for(var j in results[i]){
				allResults.push({
					content:results[i][j].content,
					description:(results[i][j].name?" <dim>"+utils.escapeXml(results[i][j].name)+"</dim> - ":"" )
					+utils.escapeXml(results[i][j].title) +" "
					+(results[i][j].url?" <url>&lt;"+utils.escapeXml(results[i][j].url)+"&gt;</url>":"")
				});
			}
		}
		suggest(allResults);
	}.bind(suggest));
};

var timeout = undefined;
chrome.omnibox.onInputChanged.addListener(function(text, suggest){
	if(timeout){
		clearTimeout(timeout);
	}
	 timeout = setTimeout(function(obj){
		triggerSearch(obj.text, obj.suggest);
	}, 500, {text:text, suggest:suggest})
});


chrome.omnibox.onInputEntered.addListener(function(selectedItem){
		for(var i in searchEngines){
			var searchEngine = searchEngines[i];
			if(selectedItem.match(searchEngine.answerRegex) != null){
				return searchEngine.suggestion(selectedItem);
			}
		}
});



/**
	Handle API
*/
chrome.runtime.onConnectExternal.addListener(function(port) {
	port.onMessage.addListener(function(req){
		if(req.type == "registration"){
			return API.registerExtension(req, port);
		}
		if(req.type == "search"){
			return API.search(req, port, triggerSearch);
		}
	});
});

