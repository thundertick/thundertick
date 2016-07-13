/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	thundertick = __webpack_require__(16);
	thundertick= new thundertick();

	var tickbarHtml = `
		<input type = "text" id = "tickbar-text"></input>
		<div id="tickbar-result-container"></div>
	`;

	cancelTickbar = function(){
		var tickbarContainer = document.getElementsByClassName('tickbar-container')[0];
		tickbarContainer.parentNode.removeChild(tickbarContainer);
	}


	var textOnChange = function(e){
		if(e.key == "ArrowDown" || e.key == "ArrowUp" || e.key == "Enter"){
			return;
		}
		var query = e.target.value;
		thundertick.search(query, function(results){
			var resultContainer = document.getElementById('tickbar-result-container');
			resultContainer.innerHTML = "";
			for(var i in results){
				var result = results[i];
				var resultElement = document.createElement('div');
				resultElement.className = "tickbar-result";
				resultElement.setAttribute("content", result.content);
				var resultHtml = `
					<div class="search-name">${result.name}</div>
					<div class="title">${result.title}</div>
					<div class="url">${result.url}</div>
				`;
				resultElement.innerHTML = resultHtml;
				resultElement.addEventListener('click', function(){
					thundertick.select(this.getAttribute('content'));
					cancelTickbar();
				});
				resultContainer.appendChild(resultElement);
			}
		});
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

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(13);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(15)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./tickbar.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./tickbar.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(14)();
	// imports


	// module
	exports.push([module.id, ".tickbar-container {\n  all: unset;\n  position: fixed;\n  font-family: Arial, Helvetica, sans-serif;\n  top: 0px;\n  left: 0px;\n  height: 100%;\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-direction: column;\n  z-index: 100000;\n  background: rgba(255, 255, 255, 0.85); }\n  .tickbar-container #tickbar-text {\n    all: unset;\n    border: none;\n    outline: none;\n    height: 50px;\n    padding: 10px;\n    letter-spacing: 1.5px;\n    width: 40%;\n    font-size: 30px;\n    background: #3C3C3C;\n    border-radius: 5px 5px 0 0;\n    color: white;\n    margin: 0px; }\n  .tickbar-container #tickbar-result-container {\n    all: unset;\n    width: 40%;\n    max-height: 300px;\n    overflow-y: scroll;\n    padding: 10px;\n    border-radius: 0 0 5px 5px;\n    background: #3C3C3C; }\n    .tickbar-container #tickbar-result-container .tickbar-result {\n      color: white;\n      position: relative;\n      margin-top: 15px;\n      padding: 5px;\n      border-radius: 5px; }\n      .tickbar-container #tickbar-result-container .tickbar-result.tickbar-selected {\n        background: #4295eb; }\n      .tickbar-container #tickbar-result-container .tickbar-result .search-name {\n        position: absolute;\n        top: 5px;\n        right: 5px;\n        font-size: 12px;\n        color: #cecece; }\n      .tickbar-container #tickbar-result-container .tickbar-result .title {\n        width: 80%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n        min-height: 20px; }\n      .tickbar-container #tickbar-result-container .tickbar-result .url {\n        font-size: 10px;\n        color: #cecece;\n        width: 80%;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis; }\n\n@keyframes reset {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 0; } }\n\n@keyframes fade-in {\n  0% {\n    opacity: 0; }\n  100% {\n    opacity: 1; } }\n\n.fade-in {\n  animation-name: reset, fade-in;\n  animation-duration: 100ms;\n  animation-timing-function: ease-in;\n  animation-iteration-count: 1; }\n", ""]);

	// exports


/***/ },
/* 14 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 16 */
/***/ function(module, exports) {

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



/***/ }
/******/ ]);