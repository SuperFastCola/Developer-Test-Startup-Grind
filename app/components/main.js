// main.js
var $ = require("jquery");
var React = require('react');
var Animate = require('animateCSS');
var ReactDOM = require('react-dom');
var marked = require('marked');

var Author = React.createClass({
	render: function(){
		return (
			<div>
				<span>{this.props.data.author}</span>
			</div>
		);
	}
});

var Comment = React.createClass({
	parseMarkup: function(item) {
    	var rawMarkup = marked(item.toString(), {sanitize: false});
    	//console.log(rawMarkup);

    	return { __html: rawMarkup };
  	},
	render: function(){
		return (
			<div>
				<Author data={this.props.data} /> 
				<div dangerouslySetInnerHTML={this.parseMarkup(this.props.data.comment)} />
			</div>
		);
	}
});

var CommentList = React.createClass({
	getInitialState: function(){
		return {
			comments: [],
		};
	},
	componentWillMount: function(){
		var allComments = [];
		this.props.comments.map(function(com){
			allComments.push(<Comment data={com} key={com.id} />)			
				//{test: this.state.test.concat([<Comment data={com} key={com.id} />])});
		}.bind(this));

		this.setState({comments:allComments});
	},
	render: function(){
		return (
			<div className="commentList">
				{this.state.comments}
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
