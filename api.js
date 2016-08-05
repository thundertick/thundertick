/*
	API Requests are in the format 
	{
		type:[REQUEST-TYPE],
		body:{
			[Request body]
		}
	}
	*/

	module.exports = {
		getDocs:function(req, port){
			var results = [];
			for(var i in searchEngines){
				if(searchEngines[i].enabled == false || !searchEngines[i].doc){
					continue;
				}
				results.push(searchEngines[i].doc);
			}
			port.postMessage({
				type:"doc-results",
				body:{
					results:results
				}
			});
		},
		handleSearch: function(req, port, search){
			search(req.body.query.slice(), function(results){
				port.postMessage({
					type:"search-results",
					body:{
						results:results
					}
				});
			}.bind(this), true);
		},
		handleSelection: function(req, select){
			select(req.body.query.slice());
		},
		registerExtension: function(req, port){
			if(!req.body.regex || !req.body.answerRegex){
				console.error("Registration for " + port.sender.id + " failed");
				return false;
			}
			if(!req.body.doc || !req.body.doc.type || !req.body.doc.keyword || !req.body.doc.info){
				console.error("Registration for " + port.sender.id + " failed due to missing documentation");
				return false;	
			}
			for(var i in searchEngines){
				if(searchEngines[i].name == port.sender.id){
					searchEngines[i].enabled = false;
				}
			}
			new function(regex, answerRegex, port, doc){
				console.log(regex);
				searchEngines.push({
					name:port.sender.id,
					regex:new RegExp(regex),
					doc:{
						keyword: doc.keyword,
						type:doc.type,
						info:doc.info
					},
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
								//Check results format
								for(var i in req.body.results){
									var result = req.body.results[i];
									if(!result.name || !result.content || !result.title){
										req.body.results = [];
										this.postMessage({
											type:"error",
											body:{
												error:"You are missing certain attributes in your results"
											}
										});
									}
								}
								//
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
			}(req.body.regex, req.body.answerRegex, port, req.body.doc);
			console.log("Registration for " + port.sender.id + " successful!");
			return true;
		}
	}

