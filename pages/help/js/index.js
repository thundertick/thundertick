require('../styles/help.scss');
var dommy = require("dommy.js");

var port = chrome.runtime.connect();

port.onMessage.addListener(function(req){
	if(req.type !='doc-results'){
		return;
	}
	var results = req.body.results;
	for(var i in results){
		var helpElement = dommy({
			tag:'div',
			attributes:{
				class:'command',
			},
			children:[
				{
					tag:'div',
					attributes:{
						class:'key-container'
					},
					children:[
						{
							tag:'div',
							attributes:{
								class:'key'
							},
							children:[
								{
									type:'text',
									value: results[i].keyword
								}
							]
						}
					]
				},
				{
					tag:'span',
					attributes:{
						class:'info'
					},
					children:[
						{
							type:'text',
							value:results[i].info
						}
					]
				}
			]
		});

		if(results[i].type == "search"){
			document.getElementById('search-container').appendChild(helpElement);
		}
		if(results[i].type == "command"){
			document.getElementById('command-container').appendChild(helpElement);
		}
	}
});

port.postMessage({type:"get-docs"});