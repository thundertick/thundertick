module.exports = {
    entry: ["./background.js", "./api.js"],
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
};