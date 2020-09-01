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
	postSection.addEventListener('click', requireLogIn);
	replyBlock.addEventListener('click', replyRequireLogIn);

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

	// The function we use to put not logged in user to logIn page.
	function requireLogIn(e){
		e.preventDefault();
		if(e.target.id == "newPost"){
			window.location = "../logIn/logIn.html";
		}
	}

	// The function we use to put not logged in user to logIn page.
	function replyRequireLogIn(e){
		e.preventDefault();
		if (e.target.id == 'submitResponseButton'){
			window.location = "../logIn/logIn.html";
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
