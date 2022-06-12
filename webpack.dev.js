const {
    merge
} = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devtool: "source-map",
    devServer: {
        static: "./dist",
        port: 5500,
        open: true,
        compress: true,
        client: {
            overlay: true,
            progress: true,
        },
    },
});