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

	__webpack_require__(1);
	module.exports = __webpack_require__(8);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	searchEngines = [
		__webpack_require__(2), 
		__webpack_require__(4),
		__webpack_require__(5),
		__webpack_require__(7)
	];
	var utils = __webpack_require__(6);

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

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Fuse = __webpack_require__(3);

	module.exports = {
		regex:/^t([0-9A-Za-z\s]+)/g,
		answerRegex:/tab:(\d+)/,
		tabs: [],
		fuse: null,
		onload: function(){
			this.updateTabsCache();
			chrome.tabs.onUpdated.addListener(function(){
				this.updateTabsCache();
			}.bind(this));
		},
		updateTabsCache: function(){
			chrome.tabs.queryAsync({}).then(function(tabs){
				this.tabs = tabs;
				this.fuse = new Fuse(this.tabs, {
					keys:[{name:'url', weight:0.3},{name:'title', weight:0.7}],
					caseSensitive:false,
					tokenize:true
				});
			}.bind(this));
		},
		search: function(query){
			this.query = this.regex.exec(query)[1];
			this.regex.lastIndex = 0;
			return new Promise(function(resolve, reject){
				var searchResults = [];
				var tabs = this.fuse.search(this.query);
				for(i in tabs){
					searchResults.push({
						name:"Opened tab",
						content:"tab:"+tabs[i].id,
						title:tabs[i].title,
						url:tabs[i].url
					});
				}
				resolve(searchResults);
			}.bind(this));
		},
		suggestion: function(suggestion){
			var tabId = this.answerRegex.exec(suggestion)[1];
			this.answerRegex.lastIndex = 0;
			console.log(this.tabs);
			chrome.tabs.update(parseInt(tabId),{
				active:true
			});
			for(var i in this.tabs){
				if(this.tabs[i].id == parseInt(tabId)){
					chrome.windows.update(this.tabs[i].windowId, {
						focused:true
					});
				}
			}
		}
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * @license
	 * Fuse - Lightweight fuzzy-search
	 *
	 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
	 * All Rights Reserved. Apache Software License 2.0
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License")
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */
	;(function (global) {
	  'use strict'

	  function log () {
	    console.log.apply(console, arguments)
	  }

	  var MULTI_CHAR_REGEX = / +/g

	  var defaultOptions = {
	    // The name of the identifier property. If specified, the returned result will be a list
	    // of the items' dentifiers, otherwise it will be a list of the items.
	    id: null,

	    // Indicates whether comparisons should be case sensitive.

	    caseSensitive: false,

	    // An array of values that should be included from the searcher's output. When this array
	    // contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`.
	    // Values you can include are `score`, `matchedLocations`
	    include: [],

	    // Whether to sort the result list, by score
	    shouldSort: true,

	    // The search function to use
	    // Note that the default search function ([[Function]]) must conform to the following API:
	    //
	    //  @param pattern The pattern string to search
	    //  @param options The search option
	    //  [[Function]].constructor = function(pattern, options)
	    //
	    //  @param text: the string to search in for the pattern
	    //  @return Object in the form of:
	    //    - isMatch: boolean
	    //    - score: Int
	    //  [[Function]].prototype.search = function(text)
	    searchFn: BitapSearcher,

	    // Default sort function
	    sortFn: function (a, b) {
	      return a.score - b.score
	    },

	    // The get function to use when fetching an object's properties.
	    // The default will search nested paths *ie foo.bar.baz*
	    getFn: deepValue,

	    // List of properties that will be searched. This also supports nested properties.
	    keys: [],

	    // Will print to the console. Useful for debugging.
	    verbose: false,

	    // When true, the search algorithm will search individual words **and** the full string,
	    // computing the final score as a function of both. Note that when `tokenize` is `true`,
	    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
	    tokenize: false
	  }

	  function Fuse (list, options) {
	    var i
	    var len
	    var key
	    var keys

	    this.list = list
	    this.options = options = options || {}

	    // Add boolean type options
	    for (i = 0, keys = ['sort', 'shouldSort', 'verbose', 'tokenize'], len = keys.length; i < len; i++) {
	      key = keys[i]
	      this.options[key] = key in options ? options[key] : defaultOptions[key]
	    }
	    // Add all other options
	    for (i = 0, keys = ['searchFn', 'sortFn', 'keys', 'getFn', 'include'], len = keys.length; i < len; i++) {
	      key = keys[i]
	      this.options[key] = options[key] || defaultOptions[key]
	    }
	  }

	  Fuse.VERSION = '2.2.0'

	  /**
	   * Sets a new list for Fuse to match against.
	   * @param {Array} list
	   * @return {Array} The newly set list
	   * @public
	   */
	  Fuse.prototype.set = function (list) {
	    this.list = list
	    return list
	  }

	  Fuse.prototype.search = function (pattern) {
	    if (this.options.verbose) log('\nSearch term:', pattern, '\n')

	    this.pattern = pattern
	    this.results = []
	    this.resultMap = {}
	    this._keyMap = null

	    this._prepareSearchers()
	    this._startSearch()
	    this._computeScore()
	    this._sort()

	    var output = this._format()
	    return output
	  }

	  Fuse.prototype._prepareSearchers = function () {
	    var options = this.options
	    var pattern = this.pattern
	    var searchFn = options.searchFn
	    var tokens = pattern.split(MULTI_CHAR_REGEX)
	    var i = 0
	    var len = tokens.length

	    if (this.options.tokenize) {
	      this.tokenSearchers = []
	      for (; i < len; i++) {
	        this.tokenSearchers.push(new searchFn(tokens[i], options))
	      }
	    }
	    this.fullSeacher = new searchFn(pattern, options)
	  }

	  Fuse.prototype._startSearch = function () {
	    var options = this.options
	    var getFn = options.getFn
	    var list = this.list
	    var listLen = list.length
	    var keys = this.options.keys
	    var keysLen = keys.length
	    var key
	    var weight
	    var item = null
	    var i
	    var j

	    // Check the first item in the list, if it's a string, then we assume
	    // that every item in the list is also a string, and thus it's a flattened array.
	    if (typeof list[0] === 'string') {
	      // Iterate over every item
	      for (i = 0; i < listLen; i++) {
	        this._analyze('', list[i], i, i)
	      }
	    } else {
	      this._keyMap = {}
	      // Otherwise, the first item is an Object (hopefully), and thus the searching
	      // is done on the values of the keys of each item.
	      // Iterate over every item
	      for (i = 0; i < listLen; i++) {
	        item = list[i]
	        // Iterate over every key
	        for (j = 0; j < keysLen; j++) {
	          key = keys[j]
	          if (typeof key !== 'string') {
	            weight = (1 - key.weight) || 1
	            this._keyMap[key.name] = {
	              weight: weight
	            }
	            if (key.weight <= 0 || key.weight > 1) {
	              throw new Error('Key weight has to be > 0 and <= 1')
	            }
	            key = key.name
	          } else {
	            this._keyMap[key] = {
	              weight: 1
	            }
	          }
	          this._analyze(key, getFn(item, key, []), item, i)
	        }
	      }
	    }
	  }

	  Fuse.prototype._analyze = function (key, text, entity, index) {
	    var options = this.options
	    var words
	    var scores
	    var exists = false
	    var tokenSearchers
	    var tokenSearchersLen
	    var existingResult
	    var averageScore
	    var finalScore
	    var scoresLen
	    var mainSearchResult
	    var tokenSearcher
	    var termScores
	    var word
	    var tokenSearchResult
	    var i
	    var j

	    // Check if the text can be searched
	    if (text === undefined || text === null) {
	      return
	    }

	    scores = []

	    if (typeof text === 'string') {
	      words = text.split(MULTI_CHAR_REGEX)

	      if (options.verbose) log('---------\nKey:', key)
	      if (options.verbose) log('Record:', words)

	      if (this.options.tokenize) {
	        tokenSearchers = this.tokenSearchers
	        tokenSearchersLen = tokenSearchers.length

	        for (i = 0; i < this.tokenSearchers.length; i++) {
	          tokenSearcher = this.tokenSearchers[i]
	          termScores = []
	          for (j = 0; j < words.length; j++) {
	            word = words[j]
	            tokenSearchResult = tokenSearcher.search(word)
	            if (tokenSearchResult.isMatch) {
	              exists = true
	              termScores.push(tokenSearchResult.score)
	              scores.push(tokenSearchResult.score)
	            } else {
	              termScores.push(1)
	              scores.push(1)
	            }
	          }
	          if (options.verbose) log('Token scores:', termScores)
	        }

	        averageScore = scores[0]
	        scoresLen = scores.length
	        for (i = 1; i < scoresLen; i++) {
	          averageScore += scores[i]
	        }
	        averageScore = averageScore / scoresLen

	        if (options.verbose) log('Token score average:', averageScore)
	      }

	      // Get the result
	      mainSearchResult = this.fullSeacher.search(text)
	      if (options.verbose) log('Full text score:', mainSearchResult.score)

	      finalScore = mainSearchResult.score
	      if (averageScore !== undefined) {
	        finalScore = (finalScore + averageScore) / 2
	      }

	      if (options.verbose) log('Score average:', finalScore)

	      // If a match is found, add the item to <rawResults>, including its score
	      if (exists || mainSearchResult.isMatch) {
	        // Check if the item already exists in our results
	        existingResult = this.resultMap[index]

	        if (existingResult) {
	          // Use the lowest score
	          // existingResult.score, bitapResult.score
	          existingResult.output.push({
	            key: key,
	            score: finalScore,
	            matchedIndices: mainSearchResult.matchedIndices
	          })
	        } else {
	          // Add it to the raw result list
	          this.resultMap[index] = {
	            item: entity,
	            output: [{
	              key: key,
	              score: finalScore,
	              matchedIndices: mainSearchResult.matchedIndices
	            }]
	          }

	          this.results.push(this.resultMap[index])
	        }
	      }
	    } else if (isArray(text)) {
	      for (i = 0; i < text.length; i++) {
	        this._analyze(key, text[i], entity, index)
	      }
	    }
	  }

	  Fuse.prototype._computeScore = function () {
	    var i
	    var j
	    var keyMap = this._keyMap
	    var totalScore
	    var output
	    var scoreLen
	    var score
	    var weight
	    var results = this.results
	    var bestScore
	    var nScore

	    if (this.options.verbose) log('\n\nComputing score:\n')

	    for (i = 0; i < results.length; i++) {
	      totalScore = 0
	      output = results[i].output
	      scoreLen = output.length

	      bestScore = 1

	      for (j = 0; j < scoreLen; j++) {
	        score = output[j].score
	        weight = keyMap ? keyMap[output[j].key].weight : 1

	        nScore = score * weight

	        if (weight !== 1) {
	          bestScore = Math.min(bestScore, nScore)
	        } else {
	          totalScore += nScore
	          output[j].nScore = nScore
	        }
	      }

	      if (bestScore === 1) {
	        results[i].score = totalScore / scoreLen
	      } else {
	        results[i].score = bestScore
	      }

	      if (this.options.verbose) log(results[i])
	    }
	  }

	  Fuse.prototype._sort = function () {
	    var options = this.options
	    if (options.shouldSort) {
	      if (options.verbose) log('\n\nSorting....')
	      this.results.sort(options.sortFn)
	    }
	  }

	  Fuse.prototype._format = function () {
	    var options = this.options
	    var getFn = options.getFn
	    var finalOutput = []
	    var item
	    var i
	    var len
	    var results = this.results
	    var replaceValue
	    var getItemAtIndex
	    var include = options.include

	    if (options.verbose) log('\n\nOutput:\n\n', results)

	    // Helper function, here for speed-up, which replaces the item with its value,
	    // if the options specifies it,
	    replaceValue = options.id ? function (index) {
	      results[index].item = getFn(results[index].item, options.id, [])[0]
	    } : function () {}

	    getItemAtIndex = function (index) {
	      var record = results[index]
	      var data
	      var includeVal
	      var j
	      var output
	      var _item
	      var _result

	      // If `include` has values, put the item in the result
	      if (include.length > 0) {
	        data = {
	          item: record.item
	        }
	        if (include.indexOf('matches') !== -1) {
	          output = record.output
	          data.matches = []
	          for (j = 0; j < output.length; j++) {
	            _item = output[j]
	            _result = {
	              indices: _item.matchedIndices
	            }
	            if (_item.key) {
	              _result.key = _item.key
	            }
	            data.matches.push(_result)
	          }
	        }

	        if (include.indexOf('score') !== -1) {
	          data.score = results[index].score
	        }

	      } else {
	        data = record.item
	      }

	      return data
	    }

	    // From the results, push into a new array only the item identifier (if specified)
	    // of the entire item.  This is because we don't want to return the <results>,
	    // since it contains other metadata
	    for (i = 0, len = results.length; i < len; i++) {
	      replaceValue(i)
	      item = getItemAtIndex(i)
	      finalOutput.push(item)
	    }

	    return finalOutput
	  }

	  // Helpers

	  function deepValue (obj, path, list) {
	    var firstSegment
	    var remaining
	    var dotIndex
	    var value
	    var i
	    var len

	    if (!path) {
	      // If there's no path left, we've gotten to the object we care about.
	      list.push(obj)
	    } else {
	      dotIndex = path.indexOf('.')

	      if (dotIndex !== -1) {
	        firstSegment = path.slice(0, dotIndex)
	        remaining = path.slice(dotIndex + 1)
	      } else {
	        firstSegment = path
	      }

	      value = obj[firstSegment]
	      if (value !== null && value !== undefined) {
	        if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
	          list.push(value)
	        } else if (isArray(value)) {
	          // Search each item in the array.
	          for (i = 0, len = value.length; i < len; i++) {
	            deepValue(value[i], remaining, list)
	          }
	        } else if (remaining) {
	          // An object. Recurse further.
	          deepValue(value, remaining, list)
	        }
	      }
	    }

	    return list
	  }

	  function isArray (obj) {
	    return Object.prototype.toString.call(obj) === '[object Array]'
	  }

	  /**
	   * Adapted from "Diff, Match and Patch", by Google
	   *
	   *   http://code.google.com/p/google-diff-match-patch/
	   *
	   * Modified by: Kirollos Risk <kirollos@gmail.com>
	   * -----------------------------------------------
	   * Details: the algorithm and structure was modified to allow the creation of
	   * <Searcher> instances with a <search> method which does the actual
	   * bitap search. The <pattern> (the string that is searched for) is only defined
	   * once per instance and thus it eliminates redundant re-creation when searching
	   * over a list of strings.
	   *
	   * Licensed under the Apache License, Version 2.0 (the "License")
	   * you may not use this file except in compliance with the License.
	   */
	  function BitapSearcher (pattern, options) {
	    options = options || {}
	    this.options = options
	    this.options.location = options.location || BitapSearcher.defaultOptions.location
	    this.options.distance = 'distance' in options ? options.distance : BitapSearcher.defaultOptions.distance
	    this.options.threshold = 'threshold' in options ? options.threshold : BitapSearcher.defaultOptions.threshold
	    this.options.maxPatternLength = options.maxPatternLength || BitapSearcher.defaultOptions.maxPatternLength

	    this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase()
	    this.patternLen = pattern.length

	    if (this.patternLen <= this.options.maxPatternLength) {
	      this.matchmask = 1 << (this.patternLen - 1)
	      this.patternAlphabet = this._calculatePatternAlphabet()
	    }
	  }

	  BitapSearcher.defaultOptions = {
	    // Approximately where in the text is the pattern expected to be found?
	    location: 0,

	    // Determines how close the match must be to the fuzzy location (specified above).
	    // An exact letter match which is 'distance' characters away from the fuzzy location
	    // would score as a complete mismatch. A distance of '0' requires the match be at
	    // the exact location specified, a threshold of '1000' would require a perfect match
	    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
	    distance: 100,

	    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
	    // (of both letters and location), a threshold of '1.0' would match anything.
	    threshold: 0.6,

	    // Machine word size
	    maxPatternLength: 32
	  }

	  /**
	   * Initialize the alphabet for the Bitap algorithm.
	   * @return {Object} Hash of character locations.
	   * @private
	   */
	  BitapSearcher.prototype._calculatePatternAlphabet = function () {
	    var mask = {},
	      i = 0

	    for (i = 0; i < this.patternLen; i++) {
	      mask[this.pattern.charAt(i)] = 0
	    }

	    for (i = 0; i < this.patternLen; i++) {
	      mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1)
	    }

	    return mask
	  }

	  /**
	   * Compute and return the score for a match with `e` errors and `x` location.
	   * @param {number} errors Number of errors in match.
	   * @param {number} location Location of match.
	   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
	   * @private
	   */
	  BitapSearcher.prototype._bitapScore = function (errors, location) {
	    var accuracy = errors / this.patternLen,
	      proximity = Math.abs(this.options.location - location)

	    if (!this.options.distance) {
	      // Dodge divide by zero error.
	      return proximity ? 1.0 : accuracy
	    }
	    return accuracy + (proximity / this.options.distance)
	  }

	  /**
	   * Compute and return the result of the search
	   * @param {String} text The text to search in
	   * @return {Object} Literal containing:
	   *                          {Boolean} isMatch Whether the text is a match or not
	   *                          {Decimal} score Overall score for the match
	   * @public
	   */
	  BitapSearcher.prototype.search = function (text) {
	    var options = this.options
	    var i
	    var j
	    var textLen
	    var location
	    var threshold
	    var bestLoc
	    var binMin
	    var binMid
	    var binMax
	    var start, finish
	    var bitArr
	    var lastBitArr
	    var charMatch
	    var score
	    var locations
	    var matches
	    var isMatched
	    var matchMask
	    var matchedIndices
	    var matchesLen
	    var match

	    text = options.caseSensitive ? text : text.toLowerCase()

	    if (this.pattern === text) {
	      // Exact match
	      return {
	        isMatch: true,
	        score: 0,
	        matchedIndices: [[0, text.length - 1]]
	      }
	    }

	    // When pattern length is greater than the machine word length, just do a a regex comparison
	    if (this.patternLen > options.maxPatternLength) {
	      matches = text.match(new RegExp(this.pattern.replace(MULTI_CHAR_REGEX, '|')))
	      isMatched = !!matches

	      if (isMatched) {
	        matchedIndices = []
	        for (i = 0, matchesLen = matches.length; i < matchesLen; i++) {
	          match = matches[i]
	          matchedIndices.push([text.indexOf(match), match.length - 1])
	        }
	      }

	      return {
	        isMatch: isMatched,
	        // TODO: revisit this score
	        score: isMatched ? 0.5 : 1,
	        matchedIndices: matchedIndices
	      }
	    }

	    location = options.location
	    // Set starting location at beginning text and initialize the alphabet.
	    textLen = text.length
	    // Highest score beyond which we give up.
	    threshold = options.threshold
	    // Is there a nearby exact match? (speedup)
	    bestLoc = text.indexOf(this.pattern, location)

	    // a mask of the matches
	    matchMask = []
	    for (i = 0; i < textLen; i++) {
	      matchMask[i] = 0
	    }

	    if (bestLoc != -1) {
	      threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
	      // What about in the other direction? (speed up)
	      bestLoc = text.lastIndexOf(this.pattern, location + this.patternLen)

	      if (bestLoc != -1) {
	        threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
	      }
	    }

	    bestLoc = -1
	    score = 1
	    locations = []
	    binMax = this.patternLen + textLen

	    for (i = 0; i < this.patternLen; i++) {
	      // Scan for the best match; each iteration allows for one more error.
	      // Run a binary search to determine how far from the match location we can stray
	      // at this error level.
	      binMin = 0
	      binMid = binMax
	      while (binMin < binMid) {
	        if (this._bitapScore(i, location + binMid) <= threshold) {
	          binMin = binMid
	        } else {
	          binMax = binMid
	        }
	        binMid = Math.floor((binMax - binMin) / 2 + binMin)
	      }

	      // Use the result from this iteration as the maximum for the next.
	      binMax = binMid
	      start = Math.max(1, location - binMid + 1)
	      finish = Math.min(location + binMid, textLen) + this.patternLen

	      // Initialize the bit array
	      bitArr = Array(finish + 2)

	      bitArr[finish + 1] = (1 << i) - 1

	      for (j = finish; j >= start; j--) {
	        charMatch = this.patternAlphabet[text.charAt(j - 1)]

	        if (charMatch) {
	          matchMask[j - 1] = 1
	        }

	        if (i === 0) {
	          // First pass: exact match.
	          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch
	        } else {
	          // Subsequent passes: fuzzy match.
	          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch | (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1]
	        }
	        if (bitArr[j] & this.matchmask) {
	          score = this._bitapScore(i, j - 1)

	          // This match will almost certainly be better than any existing match.
	          // But check anyway.
	          if (score <= threshold) {
	            // Indeed it is
	            threshold = score
	            bestLoc = j - 1
	            locations.push(bestLoc)

	            if (bestLoc > location) {
	              // When passing loc, don't exceed our current distance from loc.
	              start = Math.max(1, 2 * location - bestLoc)
	            } else {
	              // Already passed loc, downhill from here on in.
	              break
	            }
	          }
	        }
	      }

	      // No hope for a (better) match at greater error levels.
	      if (this._bitapScore(i + 1, location) > threshold) {
	        break
	      }
	      lastBitArr = bitArr
	    }

	    matchedIndices = this._getMatchedIndices(matchMask)

	    // Count exact matches (those with a score of 0) to be "almost" exact
	    return {
	      isMatch: bestLoc >= 0,
	      score: score === 0 ? 0.001 : score,
	      matchedIndices: matchedIndices
	    }
	  }

	  BitapSearcher.prototype._getMatchedIndices = function (matchMask) {
	    var matchedIndices = []
	    var start = -1
	    var end = -1
	    var i = 0
	    var match
	    var len = len = matchMask.length
	    for (; i < len; i++) {
	      match = matchMask[i]
	      if (match && start === -1) {
	        start = i
	      } else if (!match && start !== -1) {
	        end = i - 1
	        matchedIndices.push([start, end])
	        start = -1
	      }
	    }
	    if (matchMask[i - 1]) {
	      matchedIndices.push([start, i - 1])
	    }
	    return matchedIndices
	  }

	  // Export to Common JS Loader
	  if (true) {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = Fuse
	  } else if (typeof define === 'function' && define.amd) {
	    // AMD. Register as an anonymous module.
	    define(function () {
	      return Fuse
	    })
	  } else {
	    // Browser globals (root is window)
	    global.Fuse = Fuse
	  }

	})(this)


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = {
		regex:/^find\s([0-9A-Za-z\s]+)/g,
		answerRegex:/tab-found:(\d+)/,
		onload: function(){

		},
		updateTabsCache: function(){

		},
		search: function(query){
			var searchQuery = this.regex.exec(query)[1];
			console.log(searchQuery);
			this.regex.lastIndex = 0;
			return new Promise(function(resolve, reject){
				chrome.tabs.queryAsync({})
				.then(function(tabs){
					var searchPromises = tabs.map(function(item){
						return chrome.tabs.executeScriptAsync(item.id,{
							code:"find('"+ this + "', false, undefined, true, false, false, true)",	
							runAt:"document_end"
						}).then(function(result){
							return {tab:this, result:result[0]};
						}.bind(item))
						.catch(function(result){
							return {tab:this, result:undefined}
						}.bind(item));
					}.bind(searchQuery));
					Promise.all(searchPromises).then(function(found){
						var searchResults = [];
						for(i in found){
							if(found[i].result)
							searchResults.push({
								name:"Text find",
								content:"tab-found:"+found[i].tab.id,
								title: found[i].tab.title, 
								url: found[i].tab.url
							});
						}
						console.log(searchResults);
						this(searchResults);
					}.bind(this));
				}.bind(resolve));
			});
		},
		suggestion: function(suggestion){
			var tabId = this.answerRegex.exec(suggestion)[1];
			this.answerRegex.lastIndex = 0;
			console.log(this.tabs);
			chrome.tabs.update(parseInt(tabId),{
				active:true
			});
			for(var i in this.tabs){
				if(this.tabs[i].id == parseInt(tabId)){
					chrome.windows.update(this.tabs[i].windowId, {
						focused:true
					});
				}
			}
		}
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var utils = __webpack_require__(6);

	module.exports = {
		regex:/^h(.+)/g,
		answerRegex:/history:(.+)/,
		tabs: [],
		fuse: null,
		onload: function(){

		},
		search: function(query){
			this.query = this.regex.exec(query)[1];
			this.regex.lastIndex = 0;
			return new Promise(function(resolve, reject){
				chrome.history.searchAsync({text:this.query, maxResults: 5})
				.then(function(results){
					var searchResults = [];
					for(i in results){
						searchResults.push({
							name:"History",
							content:"history:"+results[i].url,
							title:results[i].title,
							url:results[i].url
						});
					}
					resolve(searchResults);
				});
			}.bind(this));
		},
		suggestion: function(suggestion){
			var url = this.answerRegex.exec(suggestion)[1];
			this.answerRegex.lastIndex = 0;
			chrome.tabs.create({url:url, active:true});
		}
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

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

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = {
		regex:/^mute|^unmute/g,
		answerRegex:/^mute:(.+)/,
		onload: function(){

		},
		search: function(query){
			this.query = this.regex.exec(query)[1];
			this.regex.lastIndex = 0;
			return new Promise(function(resolve, reject){
				chrome.tabs.queryAsync({'audible':true})
				.then(function(tabs){
					var searchResults = [];
					for(var i in tabs){
						var name = (tabs[i].mutedInfo.muted?"Unmute Tab":"Mute Tab");
						searchResults.push({
							name:name,
							content:"mute:"+tabs[i].id,
							title:tabs[i].title,
							url:tabs[i].url
						});
					}
					resolve(searchResults);
				});
			}.bind(this));
		},
		suggestion: function(suggestion){
			var tabId = this.answerRegex.exec(suggestion)[1];
			this.answerRegex.lastIndex = 0;
			chrome.tabs.getAsync(parseInt(tabId))
			.then(function(tab){
				chrome.tabs.update(tab.id,{
					muted:!tab.mutedInfo.muted
				});
			});
		}
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
		API Requests are in the format 
		{
			type:[REQUEST-TYPE],
			body:{
				[Request body]
			}
		}
	*/


	chrome.runtime.onConnectExternal.addListener(function(port) {
		port.onMessage.addListener(function(req){
			if(req.type == "registration"){
				return API.registerExtension(req, port);
			}
		});
	});

	var API = {
		registerExtension: function(req, port){
			if(!req.body.regex || !req.body.answerRegex){
					console.err("Registration for " + port.sender.id + " failed");
					return false;
			}
			for(var i in searchEngines){
				if(searchEngines[i].name == port.sender.id){
					searchEngines[i].enabled = false;
				}
			}
			new function(regex, answerRegex, port){
				console.log(regex);
				searchEngines.push({
					name:port.sender.id,
					regex:new RegExp(regex),
					answerRegex:new RegExp(answerRegex),
					search: function(query){
						this.postMessage({
							type:"search-query",
							body:{
								query:query
							}
						});
						return new Promise(function(resolve, reject){
							this.resolve = resolve;
							this.reject = reject;	
							var listener = this.onMessage.addListener(function(req){
								if(req.type == "results"){
									this.onMessage.removeListener(listener);
									this.resolve(req.body.results);
								}
							}.bind(this));
						}.bind(this));
					}.bind(port),
					suggestion: function(query){
						this.postMessage({
							type:"search-selection",
							body:{
								query:query
							}
						});
					}.bind(port)
				});	
			}(req.body.regex, req.body.answerRegex, port);
			console.log("Registration for " + port.sender.id + " successful!");
			return true;
		}
	}



/***/ }
/******/ ]);