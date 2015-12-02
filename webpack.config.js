var webpack = require("webpack");

module.exports = {
	entry: __dirname + "/app/components/main.js",
    output: {
        path: __dirname + "/public/scripts",
        filename: "bundle.js",
    },
    resolve: {
    	alias: { 
    		jquery: "../modules/jquery-1.11.3.min.js",
    		animateCSS: "../modules/animate.min.css" 
    	}
    },
    module:{
    	loaders:[
	    	{
	    		test: /\.jsx?$/,
	    		exclude: /(node_modules|bower_components)/,
	    		loader: 'babel',
	    		query:
		      	{
		        	presets:['react']
		      	}
	    	},
	    	{ test: /\.css$/, loader: "style-loader!css-loader" }

    	]
    },
    plugins: [
	 //    new webpack.optimize.UglifyJsPlugin({
		//     compress: {
		//         warnings: false
		//     }
		// })
    ]
}
