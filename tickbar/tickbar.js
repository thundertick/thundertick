require('./tickbar.scss');
tt = require('./thundertick.api.js');
thundertick= new tt();

var tickbarHtml = `
<div class = "tickbar">
	<img id = "icon" src = "${chrome.extension.getURL("/images/icon.png")}"></img>
	<input type = "text" id = "tickbar-text"></input>
	<div id="tickbar-result-container"></div>
</div>
`;

cancelTickbar = function(){
	var tickbarContainer = document.getElementsByClassName('tickbar-container')[0];
	tickbarContainer.parentNode.removeChild(tickbarContainer);
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
			var resultContainer = document.getElementById('tickbar-result-container');
			resultContainer.innerHTML = "";
			for(var i in results){
				var result = results[i];
				var resultElement = document.createElement('div');
				resultElement.className = i==0?"tickbar-result tickbar-selected":"tickbar-result";
				resultElement.setAttribute("content", result.content);
				var resultHtml = `
				<div class="search-name">${result.name?result.name:""}</div>
				<div class="title">${result.title?result.title:""}</div>
				<div class="url">${result.url?result.url:""}</div>
				`;
				resultElement.innerHTML = resultHtml;
				resultElement.addEventListener('click', function(){
					thundertick.select(this.getAttribute('content'));
					cancelTickbar();
				});
				resultContainer.appendChild(resultElement);
			}
		});
	}.bind(this), 200);
}


window.addEventListener('keydown',function(e){
	if(e.key == "`" && document.getElementById('tickbar-text') != undefined){
		cancelTickbar();
	}
	if(e.target.tagName && (e.target.tagName.toLowerCase() == "input" || e.target.tagName.toLowerCase() == "textarea" || e.target.getAttribute('contentEditable') != undefined)) {
		return;
	}
	if(e.key != "`" || document.getElementById('tickbar-text') != undefined){
		return;
	}
	e.preventDefault();
	var tickbarContainer = document.createElement('div');
	tickbarContainer.className = "tickbar-container fade-in";
	tickbarContainer.innerHTML = tickbarHtml;
	document.body.appendChild(tickbarContainer);

	var tickbar = document.getElementById('tickbar-text')
	tickbar.focus();
	tickbar.addEventListener('keyup', textOnChange);
});

window.addEventListener('keydown', function(e){
	if(e.key != "Escape"){
		return;
	}
	if(document.getElementById('tickbar-text') == undefined){
		return;
	}
	cancelTickbar();
});	



/**
	Handles arrow up and down
	*/

	window.addEventListener('keydown', function(e){
		if(e.key != "ArrowDown"){
			return;
		}
		if(document.getElementById('tickbar-text') == undefined){
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
	});

	window.addEventListener('keydown', function(e){
		if(e.key != "ArrowUp"){
			return;
		}
		if(document.getElementById('tickbar-text') == undefined){
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
	});



/**
	Handles selection of result
	*/
	window.addEventListener('keydown', function(e){
		if(e.key != "Enter"){
			return;
		}
		document.getElementsByClassName('tickbar-selected')[0].click();
	});