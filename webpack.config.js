var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	module: {
		loaders: [
		{
			test: /\.scss$/,
			loader:ExtractTextPlugin.extract("style","css!sass")
		}
		]
	},
	plugins: [
		new ExtractTextPlugin("./dist/[name].css")
	],
	entry: {
		bundle: "./background.js",
		tickbar: ["./tickbar/tickbar.js"],
		help:"./pages/help/js/index.js"
	},
	output: {
		path: __dirname,
		filename: "./dist/[name].js"
	},
};