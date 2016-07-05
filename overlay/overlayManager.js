module.exports = function(){
	this.overlayPort = undefined;
	var self = this;
	chrome.omnibox.onInputStarted.addListener(function(text, suggest){
		chrome.tabs.queryAsync({active:true, currentWindow:true})
		.then(function(tab){
			tab = tab[0];
			if(tab.url.indexOf("chrome://")!= -1){
				return;
			}
			return chrome.tabs.executeScriptAsync(tab.id,{
				file:'overlay/construct.js',
				runAt:'document_end'
			});
		});
	});

	chrome.omnibox.onInputCancelled.addListener(function(){
		chrome.tabs.queryAsync({active:true, currentWindow:true})
		.then(function(tab){
			tab = tab[0];
			if(tab.url.indexOf("chrome://")!= -1){
				return;
			}
			return chrome.tabs.executeScriptAsync(tab.id,{
				file:'overlay/destroy.js',
				runAt:'document_end'
			});
		});
	});

	//Overlay messaging
	chrome.runtime.onConnect.addListener(function(port) {
		if(port.name != "overlay"){
			return;
		}
		this.overlayPort = port;
		this.overlayPort.postMessage({
			type:'change-display-message',
			body:{
				data:"Thundertick"
			}
		})
	});

	this.changeMessage = function(str){
		if(this.overlayPort){
			this.overlayPort.postMessage({
				type:'change-display-message',
				body:{
					data:str
				}
			});
		}
	}
	return this;
};