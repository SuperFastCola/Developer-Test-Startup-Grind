// main.js
var $ = require("jquery");
var React = require('react');
var Animate = require('animateCSS');
var ReactDOM = require('react-dom');
var marked = require('marked');
var css = require("stylesSheet");

//render author profile
var Author = React.createClass({
	render: function(){
		return (
			<div className="author-holder">
				<svg className="authorBubbleHolder">
					<path className="authorBubble" d="M 3 3 L 100 3 L 100 60 L 80 40 L 3 40 Z" />
				</svg>
				<span className="author-name">{this.props.data.author}</span>
			</div>
		);
	}
});

//render comment date for United States.
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
			<div className="comment-date">{commentDate}</div>
		);
	}
})

//dpost deletion confirmation
var Confirmation = React.createClass({
	handleDelete: function(e){
		e.stopPropagation();

		if(e.target.getAttribute("data-delete")!=null){
			if(this.props.onDelete){
			   	this.props.onDelete(this.props.data);
			   	this.props.toggleConfirm();
			}
		}
		else{
			if(this.props.toggleConfirm){
				this.props.toggleConfirm();
			}
		}
  	},
	render: function(){
		return (
			<div className="confirmation-holder">
				<span>Delete this post?</span>
				<button className="button-confirm-delete" data-delete="1" onClick={this.handleDelete}>Yes</button>
				<button className="button-deny-delete" onClick={this.handleDelete}>No</button>
			</div>
		);
	}
});

//comment structure
var Comment = React.createClass({

	getInitialState: function(){
		return {
			public: true,
			deleted: false,
			confirmDelete: false,
			editingComment: false,
			commentBody: null,
			hasReplies: false,
			showReplies: false,
			authorLoggedIn: false 
		};
	},
	parseMarkup: function(item) {
    	var rawMarkup = marked(item.toString(), {sanitize: false});
    	//console.log(rawMarkup);

    	return { __html: rawMarkup };
  	},
  	toggleConfirm: function(){
  		this.setState({confirmDelete: !this.state.confirmDelete });
  	},
  	toggleReplies: function(e){
		this.setState({showReplies: !this.state.showReplies }); 
  	},
  	handleDelete: function(e){
  		e.stopPropagation();
  		this.toggleConfirm();
  	},
  	handleEdit: function(e){
  		e.stopPropagation();
  		this.setState({editingComment: !this.state.editingComment });  		
  	},
  	componentWillMount: function(){

  		var loggedin = (this.props.loggedInID===this.props.data.author_id)?true:false;

  		this.setState({
  			public:this.props.data.public,
  			delete:this.props.data.deleted,
  			commentBody: this.props.data.comment,
  			authorLoggedIn: loggedin
  		});

  		this.checkForReplies();

  	},
  	handleEditComment: function(e){
  		this.setState({ commentBody: String(e.target.value) });
  	},
  	checkForReplies: function(){
  		if(typeof this.props.data.comments != "undefined" && this.props.data.comments.length>0){
  			this.setState({hasReplies:true});
  		}

  	},
  	commentFunctions: function(confirmer){
  		return (
  			<div className="comment-functions">
				<button className="button-delete" onClick={this.handleDelete} >Delete</button>
				<button className="button-edit" onClick={this.handleEdit} >{ !this.state.editingComment ? "Edit" : "Save" }</button>
				{confirmer}
			</div>
		);
  	},
	render: function(){		
		if(this.state.confirmDelete){
			var confirmer = <Confirmation onDelete={this.props.onDelete} toggleConfirm={this.toggleConfirm} data={this.props.data} />;
		}

		var commentBody = <div className="comment-body" dangerouslySetInnerHTML={this.parseMarkup(this.state.commentBody)} />;
		if(this.state.editingComment){
			commentBody = <textarea className="comment-body-edit" value={this.state.commentBody} onChange={this.handleEditComment} />
		}

		return (

			<div className="comment-holder">
				<Author data={this.props.data} /> 
				<CommentDate datetime={this.props.data.datetime} />
				{commentBody}
				{ this.state.authorLoggedIn ? this.commentFunctions(confirmer) :  null }
				{this.state.hasReplies ? <button className="button-show-replies" onClick={this.toggleReplies} > { !this.state.showReplies ? "Show Comments" : "Hide Comments" }</button> : null }
				{ this.state.showReplies ? <CommentList cssClass="comments-replies-holder" comments={this.props.data.comments} loggedInID={this.props.loggedInID} /> : null }
			</div>
		);
	}
});

//comment listing
var CommentList = React.createClass({
	getInitialState: function(){
		return {
			comments: []
		};
	},
	handleCommentClick: function(obj){
		var data = this.state.comments.slice();
		var index = 0;
		data.map(function(d){
			if(d.key==obj.id){
				data.splice(index,1);
				this.setState({comments:data});
			}
			index++;
		}.bind(this));
	},
	componentWillMount: function(){
		var allComments = [];
		this.props.comments.map(function(com){
			allComments.push(<Comment data={com} onDelete={this.handleCommentClick}  key={com.id} loggedInID={this.props.loggedInID} />)
		}.bind(this));

		this.setState({comments:allComments});
	},
	render: function(){

		var cssClass="comments-holder";
		if(this.props.cssClass){
			cssClass = this.props.cssClass;
		}

		return (
			<div className={cssClass}>
				{this.state.comments}
			</div>
		);
	}
});


var ShowCommentButtons = React.createClass({
	handleButtonClick: function(){
		if(this.props.clickHandler){
			this.props.clickHandler();
		}

	},
	render: function(){
		return (
			<button className="button-show-comments" onClick={this.handleButtonClick} >
				<svg className="showIcon1Holder stack0">
					<path className="showIcon1" d="M 1 7.5 L 12.5 1 L 25 7.5 L 12.5 15 Z" />
				</svg>
				<svg className="showIcon2Holder stack1">
					<path className="showIcon2" d="M 1 1 L 12.5 7.5 L 25 1" />
				</svg>
				<svg className="showIcon2Holder stack2">
					<path className="showIcon2" d="M 1 1 L 12.5 7.5 L 25 1" />
				</svg>
				<svg className="showIcon2Holder stack3">
					<path className="showIcon2" d="M 1 1 L 12.5 7.5 L 25 1" />
				</svg>

			</button>
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
	        <section className="discussion">
	        	<div className="discussionHeader">
		        	<Author data={this.props.topic} /> 
		        	<CommentDate datetime={this.props.topic.datetime} />
		        	<h1 className="discussion-title">{this.props.topic.title}</h1>
		        	<h2 className="discussion-subtitle">{this.props.topic.discussion}</h2>
		        	<ShowCommentButtons clickHandler={this.showDetails} />
		        </div>
	        	{ this.state.showComments ? <CommentList comments={this.props.topic.comments} loggedInID={this.props.loggedInID} /> : null }
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
			discussions.push(<Discussion topic={top.discussion} key={top.discussion.id} loggedInID={this.props.loggedInID} />);
		}.bind(this));

		return (
			<div className="comment-area">{discussions}</div>
		);
	}
});


var Main = React.createClass({
	render: function(){

		return (
			<div className="container">
				<header>Discussions</header>
				<CommentArea loggedInID={this.props.loggedInID} url={"../comments.json"} />
			</div>
		);
	}
});

ReactDOM.render(<Main loggedInID={2} />,document.getElementById('app'));
