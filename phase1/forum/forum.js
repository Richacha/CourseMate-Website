'user strict'
	// number of posts.
	let numOfPosts = 0;
	// Whether the submit textfield should be displayed.
	let submitFlag = 0;
	// the index of currently selected post.
	let postIndex = 0;

	// This is the class representing a single response on post.
	class Response{
		constructor(user, comment){
			this.user = user;
			this.comment = comment;
		}
	}
	// This is the class representing an entire post, including title, user, content, and the responses of the post.
	class Post{
		constructor(user, postTitle, postContent, response, profilePicUrl){
			this.identifier = numOfPosts;
			this.profilePicUrl = profilePicUrl;
			this.user = user;
			this.postTitle = postTitle;
			this.postContent = postContent;
			this.response = response;
			numOfPosts ++;
		}
	}
	// The hardcoded responses of a post.
	const responses = []
	// These require server calls to send data.
	responses.push(new Response("Michelle", "Yes!"));
	responses.push(new Response("Borodin", "I'm taking the class too!"));
	// The hardcoded posts with zero response.
	const posts = []
	// These require server calls to send data.
	posts.push(new Post("Dimitri", "Anyone knows the average for CSC404 midterm yet?", "Group Name: Tiger", [], "../friendList/15.jpg"));
	posts.push(new Post("Alice", "I am new to CS, help my CSC108!", "Please give me some advice to learn this course better!!! Appreciate it. Group Name: Batman", [], "../friendList/3.jpg"));
	posts.push(new Post("Kevin", "Hi, need some help for CSC309", "Hi, I'm struggling with reviewing for midterm, could use some help. Group Name: Orange", [], "../friendList/2.jpg"));
	posts.push(new Post("Adm", "Want a teammate for CSC369", "Hi, I'm looking for a partner for CSC369 project2. Group Name: OMG", [], "../friendList/0.jpg"));
	posts.push(new Post("Mark", "Looking for teammate in course CSC309", "Hi, we are looking for a teammate for CSC309, contact me via my email: demo.mark@utoronto.ca. Group Name: Rock", [], "../friendList/1.jpg"));
//------------------------------------------------------------------------------------------------------------------------
	// Written for further use in the next phase, a user class that tries to represent currently logged in user.
	class User {
		constructor(username, password, profilePicUrl){
			this.username = username;
			// password is temporarily choice
			this.password = password;
			// users' profilePic
			this.profilePicUrl = profilePicUrl
		}
	}
	const users = [];
	// the user who is currently logging in.
	let currentUser = null;
	// a hardcoding sample.
	// This require a server call to send data.
	users.push(new User("Richard", "123", ""));
	currentUser = users[0].username;


//------------------------------------------------------------------------------------------------------------------------
	let postSection = document.querySelector("#postsBar");
	let mainContent = document.querySelector('#mainContent');
	let replyBlock = document.querySelector('#replyBlock');
	let searchBar = document.querySelector('#searchPost');

	searchBar.addEventListener('keyup', search);
	postSection.addEventListener('click', display);
	postSection.addEventListener('click', createNewPostPage);
	mainContent.addEventListener('click', createNewPost);
	replyBlock.addEventListener('click', replyPost);

	// After clicking on the post, display the content of the post, including its reponses on the right part of the screen.
	function display(e){
		e.preventDefault();
		if (e.target.classList.contains('forumPost')){
			// Locating the index of the post inside the list of posts, and use the index to obtain information of the post in the js posts array.
			const htmlPostArray = Array.prototype.slice.call(e.target.parentElement.children);
			postIndex = numOfPosts - (htmlPostArray.indexOf(e.target) - 2);
			// These require server calls to obtain data.
			let pendingPostTitle = posts[postIndex].postTitle;
			let pendingPostContent = posts[postIndex].postContent;
			// Innitialize the title and the content and the user of the post, display them on the right part of the screen.
			mainContent.innerHTML = `
				<div id='displayPost'>
					<div class="postRow">
						<img class="postImage" src=${posts[postIndex].profilePicUrl}>
						<div class="postAuthorContainer">
							${posts[postIndex].user}
						</div>
						<div class="postMessageContainer"><br>
							  <div class="postMessage">
							  <p class="pendingPostTitle">
							  ${pendingPostTitle}
							  </p>
							  <p class="pendingPostContent">
							  ${pendingPostContent}
							  </p>


							  </div>
						  </div>
					</div>
			  	</div>
			`
			// Add the responses of the post below the main post.
			// The following loop require server calls to obtain data.
			for (let i = 0; i <= posts[postIndex].response.length - 1; i++) {
				mainContent.innerHTML += `
					<div id='displayPost'>
						<div class="postRow">
							<img class="postImage" src="../friendList/0.jpg">
							<div class="postAuthorContainer">
								Richard
							</div>
							<div class="postMessageContainer"><br>
								  <div class="postMessage">
								  <p class="pendingPostContent">
								  ${posts[postIndex].response[i].comment}
								  </p>
								  </div>
							  </div>
						</div>
				  	</div>
				`
			}
			// Add the text area for typing responses.
			if (!submitFlag){
				replyBlock.innerHTML = ""
				let typeReply = document.createElement('div');
				typeReply.id = 'replyDiv';
				let typeFieldReply = document.createElement('textarea');
				typeFieldReply.id = 'typeFieldReply'
				let submitResponseButton = document.createElement('button');
				submitResponseButton.appendChild(document.createTextNode("Reply"));
				typeReply.appendChild(typeFieldReply);
				typeReply.appendChild(submitResponseButton);
				submitResponseButton.id = "submitResponseButton"
				replyBlock.appendChild(typeReply);
				submitFlag = 1;
			}
		}
	}

	// The funciton used for creating the page for posting new post.
	function createNewPostPage(e){
		e.preventDefault();
		// If the user clicked the button with id newPost, then display the posting page on the right part of the screen.
		if (e.target.id == 'newPost'){
			mainContent.innerHTML = `
				<form>
					<p class="newPostPageText">Title: </p> <textarea id="newPostTitle"></textarea><br>
					<p class="newPostPageText">Content:</p> <textarea id="newPostContent"></textarea><br>
					<button id="submitPostButton">Post</button>
				</form>
			`
			replyBlock.innerHTML = `
			<p class="readTerms">
			Please do not post NSFW material in the forum.
			<br> <br>
			Any NSFW material and its corresponding post/reply will be deleted.
			</p>
			`
			// Change the submit flag to 0, enabling the change of div.
			submitFlag = 0;
		}
	}

	// The function used to confirm the creating new Post action.
	function createNewPost(e){
		e.preventDefault();
		// If the user clicked the submit button in the new post web page, we construct a new post.
		if(e.target.id == 'submitPostButton'){
			// Read in the typed value of the post
			const postTitle = document.querySelector('#newPostTitle').value;
			const postContent = document.querySelector('#newPostContent').value;
			// Check whether user entered nothing for post title.
			if (postTitle != ""){
				// Add the new constructed Post to the posts array.
				// The following action require a server call to send data.
				posts.push(new Post(currentUser, postTitle, postContent, [], "../friendList/0.jpg"));
				let newPost = document.createElement('div');
				let allPosts = document.querySelectorAll('.forumPost');
				newPost.className = "forumPost";
				newPost.appendChild(document.createTextNode(postTitle));
				// Place the newest post on top of the forum posting list.
				allPosts[0].before(newPost);
				// Resetting the mainContent page in case user previously tried to submit a post without a title.
				mainContent.innerHTML = `
					<form>
						<p class="newPostPageText">Title: </p> <textarea id="newPostTitle">${postTitle}</textarea><br>
						<p class="newPostPageText">Content:</p> <textarea id="newPostContent">${postContent}</textarea><br>
						<button id="submitPostButton">Post</button>
					</form>
				`
			} else {
				// Since the user entered nothing, we warn the user that you should type a title.
				mainContent.innerHTML = `
					<form>
						<p class="newPostPageText">Title: </p> <textarea id="newPostTitle"></textarea><br>
						<p class="newPostPageText">Content:</p> <textarea id="newPostContent"></textarea><br>
						<div>
							<p id="emptyPostTitleWarning">Please enter a title!</p>
							<button id="submitPostButton">Post</button>
						</div>
					</form>
				`
			}
		}
	}

	// The function used to handle submitting replies.
	function replyPost(e){
		e.preventDefault();
		// Submit the reply of a user after clicking the submit button.
		if(e.target.id == 'submitResponseButton'){
			contentTextField = document.getElementById("typeFieldReply").value
			// If the user typed something as a reply
			if (contentTextField != ""){
				mainContent.innerHTML += `
					<div id='displayPost'>
						<div class="postRow">
							<img class="postImage" src="../friendList/0.jpg">
							<div class="postAuthorContainer">
								Richard
							</div>
							<div class="postMessageContainer"><br>
								  <div class="postMessage">
								  <p class="pendingPostContent">
								  ${contentTextField}
								  </p>
								  </div>
							  </div>
						</div>
				  	</div>
				`
				// Add the response to the responses list.
				// Require server call to send data.
				posts[postIndex].response.push(new Response("Richard", contentTextField));
			} else {
				// If the user typed nothing for reply
				replyBlock.innerHTML = `
					<div id='replyDiv'>
						<textarea id='typeFieldReply'>Please type in a response.</textarea>
						<button id='submitResponseButton'>Reply</button>
					</div>
				`
			}

		}
	}

	// The Search ability of the posts.
	function search(e){
		e.preventDefault();
		let currentSearch = e.target.value.toUpperCase();
		// The following require server call to obtain data.
		if(currentSearch != ""){
			for (let i = 0; i <= posts.length - 1; i++) {
				// Hide the ones that does not fit the search, display the ones that are searched.
				if (posts[i].postTitle.toUpperCase().includes(currentSearch) === true) {
					postSection.children[3+(numOfPosts - i - 1)].style.display = "";
				}
				else {
					postSection.children[3+(numOfPosts - i - 1)].style.display = "none";
				}
			}
		} else {
			for (let i = 3; i < postSection.children.length; i++) {
				postSection.children[i].style.display = "";
			}
		}
	}
