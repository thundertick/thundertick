module.exports = {
	promisifyChromeTabs: function(){
		console.log("Promisifying chrome.tabs");
		var chromeKeys = Object.keys(chrome.tabs);
		for(var func of chromeKeys){
			if(typeof chrome.tabs[func] == "function"){
				new function(func){
					chrome.tabs[func+"Async"] = function(args){
						return new Promise(function(resolve, reject){
							var newArgs = Array.prototype.slice.call(this);
							newArgs.push(function(args){
								this(args);
							}.bind(resolve));
							chrome.tabs[func].apply(this, newArgs);
						}.bind(arguments));
					}
				}(func);
				
			}
		}
	},
	promisifyChromeHistory: function(){
		console.log("Promisifying chrome.history");
		var chromeKeys = Object.keys(chrome.history);
		for(var func of chromeKeys){
			if(typeof chrome.history[func] == "function"){
				new function(func){
					chrome.history[func+"Async"] = function(args){
						return new Promise(function(resolve, reject){
							var newArgs = Array.prototype.slice.call(this);
							newArgs.push(function(args){
								this(args);
							}.bind(resolve));
							chrome.history[func].apply(this, newArgs);
						}.bind(arguments));
					}
				}(func);
				
			}
		}
	},
	escapeXml:function(s) {
		var XML_CHAR_MAP = {
			'<': '&lt;',
			'>': '&gt;',
			'&': '&amp;',
			'"': '&quot;',
			"'": '&apos;'
		};
		return s.replace(/[\<\>\&\"\']/g, function (ch) {
			return XML_CHAR_MAP[ch];
		});
	}

}