searchEngines = [
require('./search/tabSearch.js'), 
require('./search/openTabSearch.js'),
require('./search/historySearch.js'),
require('./search/mute.js'),
require('./search/bookmarkSearch.js'),
require('./search/downloadsSearch.js'),
require('./search/refreshAll.js'),
require('./search/sortTabs.js'),
require('./search/math.js'),
require('./search/webSearch.js'),
require('./search/screenshot.js'),
require('./search/lastActiveTab.js'),
require('./search/help.js'),
require('./search/settings.js'),
];
var utils = require('./libs/utils.js');
var API = require('./api.js');

isChrome = utils.isChrome();
isFirefox = utils.isFirefox();

window.onload = function(){
	console.debug("preparing...");
	utils.promisifyChrome(['tabs','history','bookmarks','downloads']); // History implementation is broken in FF.
	console.debug("Browser Detection \n isChrome: "+isChrome +"\n isFirefox: "+isFirefox);
	for(var i in searchEngines){
		//Disable search engines that are not compatible with the browser
		if(searchEngines[i].browsers.indexOf('chrome') != -1 && isChrome){
			searchEngines[i].enabled = true;
		} else if(searchEngines[i].browsers.indexOf('firefox') != -1 && isFirefox){
			searchEngines[i].enabled = true;
		} else{
			searchEngines[i].enabled = false;
			continue;
		}

		if(searchEngines[i].onload){
			searchEngines[i].onload();
		}
	}
}


var triggerSearch = function(text, suggest, isTickbar){
	if(isTickbar == undefined){isTickbar = false;}
	var searchFunctions = [];
	text = text.trim();
	for(var i in searchEngines){
		var searchEngine = searchEngines[i];
		if(searchEngine.enabled == false){
			continue;
		}
		if(Array.isArray(searchEngine.regex)){
			for(i in searchEngine.regex){
				if(text.match(searchEngine.regex[i]) != null){
					searchFunctions.push(searchEngine.search(text));
					break;
				}
			}
		} else if(typeof searchEngine.regex == "function"){
			if(searchEngine.regex(text)){
				searchFunctions.push(searchEngine.search(text));
			}
		} else {
			if(text.match(searchEngine.regex) != null){
				searchFunctions.push(searchEngine.search(text));
			}
		}
	}
	Promise.all(searchFunctions).then(function(results){
		var allResults = [];
		for(var i in results){
			for(var j in results[i]){
				if(!isTickbar){
					allResults.push({
						content:results[i][j].content,
						description:(results[i][j].name?" <dim>"+utils.escapeXml(results[i][j].name)+"</dim> - ":"" )
						+utils.escapeXml(results[i][j].title) +" "
						+(results[i][j].url?" <url>&lt;"+utils.escapeXml(results[i][j].url)+"&gt;</url>":"")
					});
				} else {
					allResults.push(results[i][j]);
				}
			}
		}
		suggest(allResults);
	}.bind(suggest));
};

var handleSelection = function(query){
	for(var i in searchEngines){
		var searchEngine = searchEngines[i];
		if(query.match(searchEngine.answerRegex) != null){
			searchEngine.suggestion(query);
		}
	}
}

chrome.browserAction.onClicked.addListener(function(tab){
	chrome.tabs.executeScriptAsync(tab.id, {code:"showTickbar();"})
});

/*
*	All Firefox specific tasks go here.
* 	Most of these things are alternative implementations of things supported natively by chrome's apis
*/
if(isFirefox){
	if(!localStorage.installed){
		localStorage.installed = true;
		chrome.tabs.create({url:'./pages/install/index.html', active:true});
		chrome.tabs.queryAsync({})
		.then(function(tabs){
			for(var i in tabs){
				var tab = tabs[i];
				if(tab.url.indexOf('chrome://') != -1){
					continue;
				}
				chrome.tabs.executeScript(tab.id, {file:'./dist/tickbar.js'})
				chrome.tabs.insertCSS(tab.id, {file:'./dist/tickbar.css'})
			}
		})
	}
}

/*
*	All Chrome specific tasks go here.
* 	Most of these things are not yet compatible with Firefox Yet
*/
if(isChrome){
	chrome.omnibox.setDefaultSuggestion({
		description:"Thundertick"
	});

	chrome.runtime.onInstalled.addListener(function(details){
		if(details.reason == "install" || details.reason == "update"){
			/*Inject into all opened tabs*/
			chrome.tabs.queryAsync({})
			.then(function(tabs){
				for(var i in tabs){
					var tab = tabs[i];
					if(tab.url.indexOf('chrome://') != -1){
						continue;
					}
					chrome.tabs.executeScript(tab.id, {file:'./dist/tickbar.js'})
					chrome.tabs.executeScript(tab.id, {file:'./dist/tickbar.css'})
				}
			})
		}
		if(details.reason == "install"){
			chrome.tabs.create({url:'./pages/install/index.html', active:true});
		}
	});


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
		handleSelection(selectedItem);
	});

	/**
	Handle external API
	*/
	chrome.runtime.onConnectExternal.addListener(function(port) {
		port.onMessage.addListener(function(req){
			console.log(req);
			if(req.type == "registration"){
				return API.registerExtension(req, port);
			}
			if(req.type == "search"){
				return API.handleSearch(req, port, triggerSearch);
			}
			if(req.type == "select-result"){
				return API.handleSelection(req, handleSelection);
			}
			if(req.type == "get-docs"){
				return API.getDocs(req,port);
			}
		});
	});
}


chrome.runtime.onConnect.addListener(function(port){
	port.onMessage.addListener(function(req){
		if(req.type == "registration"){
			return API.registerExtension(req, port);
		}
		if(req.type == "search"){
			return API.handleSearch(req, port, triggerSearch);
		}
		if(req.type == "select-result"){
			return API.handleSelection(req, handleSelection);
		}
		if(req.type == "get-docs"){
			return API.getDocs(req,port);
		}
	});
});

