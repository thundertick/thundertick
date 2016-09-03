require('./tickbar.scss');
tt = require('./thundertick.api.js');
thundertick= new tt();
var isVisible = false;

var mousetrap = require('mousetrap');

var dommy = require('dommy.js');

var tickbarElement = dommy({
	tag:"div",
	attributes:{
		class:"tickbar"
	},
	children:[
		{
			tag:'img',
			attributes:{
				id:"icon",
				src:chrome.extension.getURL("/images/icon.png")
			}
		},
		{
			tag:'input',
			attributes:{
				id:"tickbar-text",
				type:"text",
				class:"mousetrap"
			}
		},
		{
			tag:'div',
			attributes:{
				id:"tickbar-result-container"
			}
		}
	]
});

cancelTickbar = function(){
	document.getElementById('tickbar-text').value = "";
	document.getElementById("tickbar-result-container").innerHTML = ""
	var tickbarContainer = document.getElementsByClassName('tickbar-container')[0];
	tickbarContainer.parentNode.removeChild(tickbarContainer);
	isVisible = false;
}

showTickbar = function(){
	if(isVisible){
		return cancelTickbar();
	}
	isVisible = true;
	var tickbarContainer = document.createElement('div');
	tickbarContainer.className = "tickbar-container fade-in";
	tickbarContainer.appendChild(tickbarElement);
	document.body.appendChild(tickbarContainer);
	var tickbar = document.getElementById('tickbar-text')
	tickbar.focus();
	tickbar.addEventListener('keyup', textOnChange);
}
var timeout = undefined;

var textOnChange = function(e){
	if(e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "Enter"){
		return;
	}
	if(timeout){
		clearTimeout(timeout);
	}
	timeout = setTimeout(function(){
		var query = e.target.value;
		thundertick.search(query, function(results){
            if(!isVisible){
                return;
            }
			var resultContainer = document.getElementById('tickbar-result-container');
			resultContainer.innerHTML = "";
			for(var i in results){
				var result = results[i];

				var resultElement = dommy({
					tag:'div',
					attributes:{
						class:i==0?"tickbar-result tickbar-selected":"tickbar-result",
						content:result.content
					},
					events:{
						"click": function(){
							thundertick.select(this.getAttribute('content'));
							cancelTickbar();
						}
					},
					children:[
						{
							tag:'div',
							attributes:{
								class:"search-name"
							},
							children:[
								{
									type:'text',
									value:result.name?result.name:""
								}
							]
						},
						{
							tag:'div',
							attributes:{
								class:"title"
							},
							children:[
								{
									type:'text',
									value:result.title?result.title:""
								}
							]
						},
						{
							tag:'div',
							attributes:{
								class:"url"
							},
							children:[
								{
									type:'text',
									value:result.url?result.url:""
								}
							]
						},
					]
				});

				resultContainer.appendChild(resultElement);

			}
		});
	}.bind(this), 200);
}

function hotkeyBinding(e){
    //Hide tickbar
    if(e.target.id == "tickbar-text"){
        showTickbar();
    }
    if(e.target.tagName && (e.target.tagName.toLowerCase() == "input" || e.target.tagName.toLowerCase() == "textarea" || e.target.getAttribute('contentEditable') != undefined)) {
        return;
    }
    showTickbar();
    e.preventDefault();
}

chrome.storage.local.get("hotkey", function(hotkey){
    var key = '';
    if(!hotkey.hotkey){
        key = '`';
        chrome.storage.local.set({hotkey:key}); //Triggers onChanged Event
    } else {
        key = hotkey.hotkey;
        Mousetrap.bind(key, hotkeyBinding, "keydown");
    }
});

chrome.storage.onChanged.addListener(function(changes){
    if(changes.hotkey == undefined){
        return;
    }
    if(changes.hotkey.oldValue)
        Mousetrap.unbind(changes.hotkey.oldValue, "keydown");

    if(!changes.hotkey.newValue){
        chrome.storage.local.set({hotkey:"`"}); //retrigger onChanged
        return;
    }
    
    Mousetrap.bind(changes.hotkey.newValue, hotkeyBinding, "keydown");

});


Mousetrap.bind('escape', function(e){
	if(!isVisible){
		return;
	}
	cancelTickbar();
}, 'keydown');



/*
    Handles arrow up and down
*/

Mousetrap.bind('down', function(e){
    if(!isVisible){
        return;
    }
    e.preventDefault();
    var resultElements = document.getElementsByClassName('tickbar-result');
    if(document.getElementsByClassName('tickbar-selected').length == 0 && resultElements.length != 0){
        resultElements[0].className ="tickbar-result tickbar-selected";
        return;
    }
    for(var i = 0; i <= resultElements.length-1;i++){
        var result = resultElements[i];
        if(result.className.indexOf('tickbar-selected') != -1){
            result.className = 'tickbar-result';
            if(i+1 > resultElements.length-1){
                resultElements[0].className ="tickbar-result tickbar-selected";
                resultElements[0].scrollIntoView(false);
            } else {
                resultElements[i+1].className = "tickbar-result tickbar-selected"
                resultElements[i+1].scrollIntoView(false);
            }
            break;
        }
    }
},'keydown');

Mousetrap.bind('up', function(e){
    if(!isVisible){
        return;
    }
    e.preventDefault();
    var resultElements = document.getElementsByClassName('tickbar-result');
    if(document.getElementsByClassName('tickbar-selected').length == 0 && resultElements.length != 0){
        resultElements[0].className ="tickbar-result tickbar-selected";
        return;
    }
    for(var i = 0; i <= resultElements.length-1;i++){
        var result = resultElements[i];
        if(result.className.indexOf('tickbar-selected') != -1){
            result.className = 'tickbar-result';
            if(i-1 < 0){
                resultElements[resultElements.length-1].className ="tickbar-result tickbar-selected";
                resultElements[resultElements.length-1].scrollIntoView(false);
            } else {
                resultElements[i-1].className = "tickbar-result tickbar-selected"
                resultElements[i-1].scrollIntoView(false);
            }
            break;
        }
    }
}, 'keydown');

/*
	Handles selection of result
*/

Mousetrap.bind('enter', function(e){
    if(!isVisible){
        return;
    }
    document.getElementsByClassName('tickbar-selected')[0].click();
}, 'keydown');