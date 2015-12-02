module.exports = {
	entry: __dirname + "/app/components/main.js",
    output: {
        path: __dirname + "/public/scripts",
        filename: "bundle.js",
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
	    	{ 
	    		test: require.resolve("jquery"), 
	    		loader: "imports?jQuery=jquery" 
	    	}

    	]
    }
}
