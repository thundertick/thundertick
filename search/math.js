var math = require('mathjs');

module.exports = {
	regex:/^\d(.+)/,
	answerRegex:/math:(.+)/,
	message:"Math",
	onload: function(){

	},
	search: function(query){
		var answer = undefined;
		try{
			answer = math.eval(query);
		} catch(e){
			return Promise.resolve([]);
		}
		if(!answer){
			return Promise.resolve([]);
		}
		if(answer.units){
			return Promise.resolve([]);
		}
		return Promise.resolve([{
			name:"Math",
			content:"math:"+answer,
			title:answer.toString(),
			url:"Selecting this will copy this to your clipboard."
		}]);
	},
	copy:function(text){
	    var input = document.createElement('textarea');
	    document.body.appendChild(input);
	    input.value = text;
	    input.focus();
	    input.select();
	    document.execCommand('Copy');
	    input.remove();
	},
	suggestion: function(suggestion){
		var answer = this.answerRegex.exec(suggestion)[1];
		this.answerRegex.lastIndex = 0;	
		this.copy(answer);
	}
};