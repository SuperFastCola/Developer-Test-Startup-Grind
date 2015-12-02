// main.js
var $ = require("jquery");
var React = require('react');
var ReactDOM = require('react-dom');

var CommentArea = React.createClass({
	getInitialState: function(){
		return {topics:[]};
	},
	componentDidMount: function() {
		$.get(this.props.url, function(data){

			if(this.isMounted()){
				this.setState({topics:data});
			}
		}.bind(this));
	},
	render: function(){

		var discussions = [];
		this.state.topics.forEach(function(top){
			discussions.push(<Discussion topic={top.discussion} key={top.discussion.id}/>);
		});

		return (
			<div className="commentArea">{discussions}</div>
		);
	}
});

var Discussion = React.createClass({
	getInitialState: function(){
		return {discussions:[]};
	},
	render: function(){
		console.log(this.props.topic);
		return (
	        <div>{this.props.topic.title}</div>
	      );
	}
});


var Main = React.createClass({
	render: function(){
		return (
			<div>
				<h1>Hello, world!</h1>
				<CommentArea url={"../comments.json"} />
			</div>
		);
	}
});

ReactDOM.render(<Main />,document.getElementById('app'));
