const webpack = require("webpack");
const path = require("path");

var jF= path.resolve(__dirname, "js");
var bF = path.resolve(__dirname, "build");

var config = {
    entry:{
        "reply":jF+"/reply.js",
        "login":jF+"/login.js",
        "post": jF+"/post.js",
        "chat": jF +"/chat.js"
          } ,
    output:{
        filename: "[name]bundle.js",
        path: bF
    },
    plugins:[
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery"
        })
    ]
};

module.exports = config;