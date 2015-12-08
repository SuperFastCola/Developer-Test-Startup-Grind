// main.js
var $ = require("jquery");
var React = require('react');
var ReactDOM = require('react-dom');
var marked = require('marked');
require("stylesSheet");

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

//confirm button icon 
var ConfirmIcon = React.createClass({
	render: function(){
		return (
			<svg className="confirm icon" data-delete={this.props.delete} onClick={this.props.handleDelete} >
				<path className="symbol" d="M 2 12 L 13 27 L 40 4" />
			</svg>
		);
	}
});

//deny button icon 
var DenyIcon = React.createClass({
	render: function(){
		return (
			<svg className="deny icon">
				<path className="symbol" d="M 3 3 L 38 38 M 38 3 L 3 38" />
			</svg>
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
var ConfirmationDelete = React.createClass({
	handleDelete: function(e){
		//e.stopPropagation();

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
				<div className="button-confirm-delete icon" data-delete="1" onClick={this.handleDelete}>
					<ConfirmIcon delete="1" onDelete={this.handleDelete} />
				</div>
				<div className="button-deny-delete icon" onClick={this.handleDelete}>
					<DenyIcon />
				</div>
			</div>
		);
	}
});

var ConfirmationEdit = React.createClass({
	handleEdit: function(e){
		e.stopPropagation();

		var className = $(e.target).hasClass("button-confirm-edit");

		if(className && this.props.onEdit){
			this.props.onEdit();
		}
  	},
	render: function(){
		return (
			<div className="confirmation-holder editor">
				<div className="button-confirm-edit icon" data-delete="1" onClick={this.handleEdit}>
					<ConfirmIcon />
				</div>
				<div className="button-deny-edit icon" onClick={this.props.onDeny}>
					<DenyIcon />
				</div>
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
			previousCommentBody: null,
			hasReplies: false,
			commentID: null,
			showReplies: false,
			authorLoggedIn: false,
			commentHeightStyle: {}
		};
	},
	parseMarkup: function(item) {
    	var rawMarkup = marked(item.toString(), {sanitize: false});
    	//console.log(rawMarkup);

    	return { __html: rawMarkup };
  	},
  	toggleConfirm: function(){
  		this.setState({
  			confirmDelete: !this.state.confirmDelete,
  			editingComment: false 

  		});
  	},
  	toggleReplies: function(e){
		this.setState({showReplies: !this.state.showReplies }); 
  	},
  	handleDelete: function(e){
  		e.stopPropagation();
  		this.toggleConfirm();
  	},
  	toggleEditing: function(e){

  		if(typeof e != "undefined"){
  			if(typeof e.target != "undefined" && $(e.target).hasClass("button-deny-edit")){
  				this.setState({commentBody: this.state.previousCommentBody});
  			}
  		}

  		this.setState({
  			editingComment: !this.state.editingComment,
  			confirmDelete: false
  		}); 

  	},
  	showEditPanel: function(){
  		this.setState({previousCommentBody: this.state.commentBody});
  		this.toggleEditing();
  	},
  	handleEdit: function(e){
  		if(this.state.editingComment){
	  		if(this.props.onEdit){
	  			this.props.onEdit(this.state.commentID,this.state.commentBody);
	  		}
  		}
  		this.toggleEditing(); 		
  	},
  	componentWillMount: function(){

  		var loggedin = (this.props.loggedInID===this.props.data.author_id)?true:false;

  		this.setState({
  			public:this.props.data.public,
  			delete:this.props.data.deleted,
  			previousCommentBody: this.props.data.comment,
  			commentBody: this.props.data.comment,
  			commentID: this.props.data.id,
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

  		if(this.state.editingComment){
			var editor = <ConfirmationEdit onEdit={this.handleEdit} onDeny={this.toggleEditing} />;
		}

		var showEditPanelClass = "button-edit icon";
		if(this.state.confirmDelete){
			showEditPanelClass += " slide-right";
		}

  		return (
  			<div className="comment-functions">
				<div className="button-delete icon" onClick={this.handleDelete} >
					<svg className="trashCanLid">
						<path className="iconLines handle" d="M 8 4 L 8 1 L 16 1 L 16 4"  />
						<path className="iconLines lid" d="M 2 5 L 23 5 L 23 10 L 2 10 Z "  />
					</svg>
					<svg className="trashCanBottom">
						<path className="iconLines can" d="M 1 1 L 20 1 L 20 18 L 1 18 Z" />
						<path className="iconLines dent1" d="M 4.5 3 L 4.5 15" />
						<path className="iconLines dent2" d="M 8.5 3 L 8.5 15" />
						<path className="iconLines dent3" d="M 12.5 3 L 12.5 15" />
						<path className="iconLines dent4" d="M 16.5 3 L 16.5 15" />
					</svg>
				</div>
				<div className={showEditPanelClass} onClick={this.showEditPanel} >
					<svg className="pencilHolder">
						<path className="pencil" d="M 1 17 L 1 15 L 15 1 L 17 3 L 3.5 16.5 Z" />
					</svg>
					<svg className="paperHolder">
						<path className="iconLines paper" d="M 1 1 L 18 1 L 18 22 L 1 22 Z" />
					</svg>
				</div>
				{confirmer}
				{editor}
			</div>
		);
  	},
  	getCommentSize: function(obj){ 
 		this.setState({
 			commentHeightStyle:{
 				height: String($(obj).height()) + "px"
 			}
  		});
  	},
  	setTextAreaFocus: function(obj){
  		$(obj).focus();
  	},
	render: function(){		

		if(this.state.confirmDelete){
			var confirmer = <ConfirmationDelete onDelete={this.props.onDelete} toggleConfirm={this.toggleConfirm} data={this.props.data} />;
		}

		var commentBody = <div className="comment-body" ref={this.getCommentSize} dangerouslySetInnerHTML={this.parseMarkup(this.state.commentBody)} />;

		if(this.state.editingComment){
			commentBody = <textarea className="comment-body-edit" ref={this.setTextAreaFocus} style={this.state.commentHeightStyle} value={this.state.commentBody} onChange={this.handleEditComment} />
		}

		var commentActionarea = null;
		if(this.state.authorLoggedIn || this.state.hasReplies){
			commentActionarea = (<div className="comment-actions"><div className="comment-actions-holder">
						{ this.state.authorLoggedIn ? this.commentFunctions(confirmer) :  null }
						{this.state.hasReplies ? <ShowCommentButtons clickHandler={this.toggleReplies} /> : null }
					</div>
				</div>)
		};


		return (

			<div className="comment-holder">
				<div className="comment-line-area">
					<svg className="comment-line-holder">
						<path className="comment-line" d="M 1 15 L 15 1 L 3000 1" />
					</svg>
				</div>
				<div className="comment-header-row">
					<div className="comment-header-columns">
						<span className="author-name-text-only">{this.props.data.author}</span>
						<CommentDate datetime={this.props.data.datetime} />
					</div>	
				</div>
				<div className="comment-body-holder">
					{commentBody}
					{commentActionarea}				
					{ this.state.showReplies ? <CommentList cssClass="comments-replies-holder" onEdit={this.props.onEdit} onDelete={this.props.onDelete} comments={this.props.data.comments} loggedInID={this.props.loggedInID} /> : null }
				</div>
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
	handleCommentClick: function(context){	
		if(this.props.onDelete){
			this.props.onDelete(context);
		}
	},
	render: function(){
		var cssClass="comments-holder";

		var allComments = [];

		this.props.comments.map(function(com){
			allComments.push(<Comment data={com} onEdit={this.props.onEdit} onDelete={this.handleCommentClick}  key={com.id} loggedInID={this.props.loggedInID} />)
		}.bind(this));

		if(this.props.cssClass){
			cssClass = this.props.cssClass;
		}

		return (
			<div className={cssClass}>
				{allComments}
			</div>
		);
	}
});


var ShowCommentButtons = React.createClass({
	getInitialState: function(){
		return {
			maximized: false,
			buttonClass: "button-show-comments",
			animating: false
		};
	},
	changeButtonClass: function(){

		this.setState({maximized: !this.state.maximized});

		if(!this.state.maximized){
			this.setState({buttonClass: "button-show-comments maximized"});
		}
		else{
			this.setState({buttonClass: "button-show-comments"});	
		}
	},
	handleButtonClick: function(e){
		e.stopPropagation();
	
		this.changeButtonClass();

		if(this.props.clickHandler){
			this.props.clickHandler();
		}
	},
	render: function(){

		var lableText = ((this.state.maximized)? "Hide":"Show") + " Comments";

		return (
			<button className={this.state.buttonClass}  
				onClick={this.handleButtonClick} 
				onMouseOver={this.handleMouseEnter} 
				onMouseLeave={this.handleMouseLeave} 
				>
				<span>{lableText}</span>
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
			showAuthorDetails: false,
			comments: null,
			closer: null,
			closerAnim: null,
		};
	},
	findCommentToEdit: function(id,body){		
		var data = this.state.comments.slice();
		var edited = false;

		//search through parents and children for matching comment id
		while(!edited){
			data.map(function(d){
				if(d.id===id){
					d.comment = body;
					edited = true;
				}

				if(typeof d.comments != "undefined"){
					var children = d.comments.slice();
					children.map(function(c){
						if(c.id===id){
							c.comment = body;
							edited = true;
						}
					});
				}

			});
		}

		this.setState({comments:data});

	},
	findCommentToDelete: function(id,objs){
		var data = objs.slice();
		var removed = false;
		var index = 0;

		//search through parents and children for matching comment id

		data.map(function(d){
			if(d.id==id){
				data.splice(index,1);
				removed = data;
			}
			index++;
		}.bind(this));

		return removed;
	},
	handleRemoveElements: function(obj){
		var dataProcessed = false;

		//superficial array search through parents
		dataProcessed = this.findCommentToDelete(obj.id,this.state.comments);	
		
		if(dataProcessed){
			this.setState({comments:dataProcessed});
			return;
		}else{
			//deeper search through child comments.
			var getChildComments = this.state.comments.slice();			
			for(var i in getChildComments){
				if(typeof getChildComments[i].comments != "undefined"){
					var childProcessed = this.findCommentToDelete(obj.id,getChildComments[i].comments);

					if(childProcessed){
						getChildComments[i].comments = childProcessed;
						break;
					}
				}
			}

			this.setState({comments:getChildComments});
		}


	},
	closeComments: function(){
		this.setState({ 
			showComments: false,
			closerAnim: null
		});
	},
	showDetails: function(){
		this.setState({
			showComments : !this.state.showComments
		});

		 if(this.state.comments==null){
		 	this.setState({
		 		comments: this.props.topic.comments
		 	});
		 }
	},
	render: function(){

		//comment delete and edit functions are passed to children to edit comments in discussion state
		return (
	        <section className="discussion">
	        	<CommentDate datetime={this.props.topic.datetime} />
	        	<div className="discussionHeader">
		        	<Author data={this.props.topic} /> 
		        	<div className="discussionTitles">
		        		<h1 className="discussion-title">{this.props.topic.title}</h1>
		        		<h2 className="discussion-subtitle">{this.props.topic.discussion}</h2>
		        	</div>
		        	<ShowCommentButtons clickHandler={this.showDetails} />
		        </div>
	        	{ this.state.showComments ? <CommentList onEdit={this.findCommentToEdit} onDelete={this.handleRemoveElements} hideClass={this.state.showComments} comments={this.state.comments} loggedInID={this.props.loggedInID} /> : null }
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

//pass in logged in author id
ReactDOM.render(<Main loggedInID={2} />,document.getElementById('app'));
