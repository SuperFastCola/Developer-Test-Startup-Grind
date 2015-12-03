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
				<span className="author-name">{this.props.data.author}</span>
			</div>
		);
	}
});

var CommentDate = React.createClass({
	render: function(){

		var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		var commentDate = new Date(this.props.datetime);

		var usHour = commentDate.getHours();
		var timeOfDay = "AM";

		if(usHour>12){
			usHour-=12;
			timeOfDay = "PM";
		}

		var minutes = commentDate.getMinutes();

		if(String(minutes).length==1){
			minutes = String("0" + minutes);
		}

		commentDate = months[commentDate.getMonth()] + 
			" " + commentDate.getDate() + ", " + commentDate.getFullYear() + 
			" - " + usHour + ":" + minutes + timeOfDay;

		return (
			<div className="commentDate">{commentDate}</div>
		);
	}
})

var Comment = React.createClass({
	getInitialState: function(){
		return {
			public: true,
			deleted: false
		};
	},
	parseMarkup: function(item) {
    	var rawMarkup = marked(item.toString(), {sanitize: false});
    	//console.log(rawMarkup);

    	return { __html: rawMarkup };
  	},
  	handleClick: function(e){
  		e.stopPropagation();
  		if(this.props.onDelete){
  			this.props.onDelete(this.props.data);
  		}
  		console.log(this.props.data);
  	},
  	componentWillMount: function(){
  		this.setState({
  			public:this.props.data.public,
  			delete:this.props.data.deleted
  		});
  	},
	render: function(){

		var replies = null;
		if(typeof this.props.data.comments != "undefined" && this.props.data.comments.length>0){
			replies = <RepliesList comments={this.props.data.comments} />			
		}

		return (
			<div className="comment"  onClick={this.handleClick}>
				<Author data={this.props.data} /> 
				<CommentDate datetime={this.props.data.datetime} />
				<div dangerouslySetInnerHTML={this.parseMarkup(this.props.data.comment)} />
				{replies}
			</div>
		);
	}
});

var CommentList = React.createClass({
	getInitialState: function(){
		return {
			comments: []
		};
	},
	handleCommentClick: function(obj){
		console.log("handleCommentClick comment List");
		var data = this.state.comments.slice();
	},
	componentWillMount: function(){
		var allComments = [];
		var index = 0;
		this.props.comments.map(function(com){
			allComments.push(<Comment data={com} key={com.id} onDelete={this.handleCommentClick}/>)
			index++;			
		}.bind(this));

		this.setState({comments:allComments});
	},
	render: function(){

		return (
			<div className="commentsList">
				{this.state.comments}
			</div>
		);
	}
});

var RepliesList = React.createClass({
	getInitialState: function(){
		return {
			replies: []
		};
	},
	handleReplyClick: function(obj){
		console.log("handleReplyClick");
		var data = this.state.replies.slice();
		console.log(data);
	},
	componentWillMount: function(){
		var allReplies = [];
		this.props.comments.map(function(com){
			allReplies.push(<Comment data={com}  onDelete={this.handleReplyClick} key={com.id} />)			
		});

		this.setState({replies:allReplies});
	},
	render: function(){

		return (
			<div className="commentsReply">
				{this.state.replies}
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
	        <section>
	        	<button onClick={this.showDetails} >SHow</button>
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
