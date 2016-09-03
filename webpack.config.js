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
		help:"./pages/help/js/index.js",
		install:"./pages/install/styles/install.scss",
		settings:"./pages/settings/js/index.js"
	},
	output: {
		path: __dirname,
		filename: "./dist/[name].js"
	},
};