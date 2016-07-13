module.exports = {
	module: {
		loaders: [
		{
			test: /\.scss$/,
			loaders: ["style", "css", "sass"]
		}
		]
	},
	entry: {
		bundle: "./background.js",
		tickbar: ["./tickbar/tickbar.js"]
	},
	output: {
		path: __dirname,
		filename: "./dist/[name].js"
	},
};