// main.js
var $ = require("jquery");
var React = require('react');
var ReactDOM = require('react-dom');

var Comment = React.createClass({
	render: function(){
		return (
			<div>{this.props.data.comment}</div>
		);
	}
});

var CommentList = React.createClass({
	getInitialState: function(){
		return {
			comments: [],
		};
	},
	render: function(){

		var allComments = [];

		this.props.comments.map(function(com){
			allComments.push(<Comment data={com} key={com.id} />)			
		});

		return (
			<div className="commentList">
				{allComments}
				{allComments}
			</div>
		);
	}
});

var Discussion = React.createClass({
	getInitialState: function(){
		return {
			showComments: false,
			showAuthorDetails: false
		};
	},
	showDetails: function(){
		 this.setState({ showComments: !this.state.showComments });
	},
	render: function(){
		return (
	        <section onClick={this.showDetails}>
	        	<h1>{this.props.topic.title}</h1>
	        	{ this.state.showComments ? <CommentList comments={this.props.topic.comments} /> : null }
	        </section>
	      );
	}
});

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


var Main = React.createClass({
	render: function(){
		return (
			<div>
				<h1>Today's Topics</h1>
				<CommentArea url={"../comments.json"} />
			</div>
		);
	}
});

ReactDOM.render(<Main />,document.getElementById('app'));
