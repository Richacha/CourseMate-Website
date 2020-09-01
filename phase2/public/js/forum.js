'use strict'
	// number of posts.
	let numOfPosts = 0;
	// the index of currently selected post.
	let postIndex = 0;
	// all users
	let everyUser = [];
	// all posts
	let everyPost = [];

	let currentUser = null;
	let allPosts = null;
	let curPostIndex = 0;

	
	const initUserUrl = '/forum/allUser'
	fetch(initUserUrl).then((res, error) => {
		if(res.status === 200){
			return res.json()
		} else {
			res.status(404).send(error)
		}
	}).then(json => {
		if(json.length != 0){
			everyUser = json
		}
	}).catch(error => {
		console.log(error)
	})


	const curUserUrl = '/profile/userinfo';
	fetch(curUserUrl).then((res, error) => {
		if(res.status === 200){
			return res.json()
		} else {
			res.status(404).send(error)
		}
	}).then(json => {
		currentUser = json.user
	}).catch(error => {
		console.log(error)
	})
//------------------------------------------------------------------------------------------------------------------------
	let postSection = document.querySelector("#postsBar");
	let mainContent = document.querySelector('#mainContent');
	let replyBlock = document.querySelector('#replyBlock');
	let searchBar = document.querySelector('#searchPost');

	//Initialize the posts
	const initForumUrl = '/forum/allPost';
	fetch(initForumUrl).then((res, error) => {
		if (res.status === 200){
			return res.json()
		} else {
			res.status(404).send(error)
		}
	}).then(json => {
		if(json.length != 0){
			everyPost = json
		}
		let postTitle = "initial";
		if(everyPost.length != 0){
			for (let i = 0; i <= everyPost.length - 1; i++) {
				let allPosts = document.querySelectorAll('.forumPost');
				postTitle = everyPost[i].title
				let newPost = document.createElement('div');
				newPost.className = "forumPost";
				newPost.appendChild(document.createTextNode(postTitle));	
				if(allPosts.length >= 1){
					allPosts[0].before(newPost);
				} else {
					postSection.appendChild(newPost);
				}
			}
		}
	}).catch(error => {
		console.log(error)
	})

	searchBar.addEventListener('keyup', search);
	postSection.addEventListener('click', display);
	postSection.addEventListener('click', createNewPostPage);
	mainContent.addEventListener('click', createNewPost);
	replyBlock.addEventListener('click', replyPost);

	// After clicking on the post, display the content of the post, including its reponses on the right part of the screen.
	function display(e){
		e.preventDefault();
		if (e.target.classList.contains('forumPost')){
			const userUrl = '/forum/allUser';
			fetch(userUrl).then((res, error) => {
				if(res.status === 200){
					return res.json()
				} else {
					res.status(404).send(error)
				}
			}).then(json => {
				if (json.length != 0){
					everyUser = json
				}
			}).catch(error => {
				console.log(error)
			})

			const forumUrl = '/forum/allPost';
			fetch(forumUrl).then((res, error) => {
				if(res.status === 200){
					return res.json()
				} else {
					res.status(404).send(error)
				}
			}).then(json => {
				const htmlPostArray = Array.prototype.slice.call(e.target.parentElement.children);
				postIndex =  json.length - (htmlPostArray.indexOf(e.target) - 2);
				curPostIndex = postIndex
				if(json.length != 0){
					everyPost = json
					allPosts = everyPost
				}
				let pendingPostTitle = (everyPost[postIndex]).title;
				let pendingPostContent = (everyPost[postIndex]).content;
				let intermediate = everyUser.filter(user => user._id === (everyPost[postIndex]).creator);
				let postingUser = intermediate[0].username;
				let postingImage = intermediate[0].profileImage;

				mainContent.innerHTML = `
					<div id='displayPost'>
						<div class="postRow">
							<img class="postImage" src=${postingImage}>
							<div class="postAuthorContainer">
								${postingUser}
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
				if (everyPost[postIndex].replies.length != 0){
					for (let i = 0; i <= (everyPost[postIndex]).replies.length - 1; i++) {
						let intermediate = everyUser.filter(user => user._id === (everyPost[postIndex]).replies[i].creator);
						let postingUser = intermediate[0].username;
						let postingContent = everyPost[postIndex].replies[i].content
						mainContent.innerHTML += `
							<div id='displayPost'>
								<div class="postRow">
									<img class="postImage" src=${intermediate[0].profileImage}>
									<div class="postAuthorContainer">
										${postingUser}
									</div>
									<div class="postMessageContainer"><br>
										  <div class="postMessage">
										  <p class="pendingPostContent">
										  ${postingContent}
										  </p>
										  </div>
									  </div>
								</div>
						  	</div>
						`
					}
				}
			}).catch(error => {
				console.log(error)
			})
			// Add the text area for typing responses.
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
					<button id="submitPostButton" onclick="location.href = '/forum/webpage';">Post</button>
				</form>
			`
			replyBlock.innerHTML = `
			<p class="readTerms">
			Please do not post NSFW material in the forum.
			<br> <br>
			Any NSFW material and its corresponding post/reply will be deleted.
			</p>
			`
		}
	}

	// The function used to confirm the creating new Post action.
	function createNewPost(e){
		e.preventDefault();
		// If the user clicked the submit button in the new post web page, we construct a new post.
		if(e.target.id == 'submitPostButton'){
			const postTitle = document.querySelector('#newPostTitle').value;
			const postContent = document.querySelector('#newPostContent').value;
			// Check whether user entered nothing for post title.
			if (postTitle != ""){
				const url = '/forum/post';
				let data = {
					title: document.querySelector('#newPostTitle').value,
					content: document.querySelector('#newPostContent').value,
					creator: currentUser._id
				}

				const request = new Request(url, {
					method: 'post',
					body: JSON.stringify(data),
					headers: {
			            'Accept': 'application/json, text/plain, */*',
			            'Content-Type': 'application/json'
			        }
				});

				fetch(request).then((res, error) => {
					if(res.status === 200){
						let newPost = document.createElement('div');
						let allPosts = document.querySelectorAll('.forumPost');
						newPost.className = "forumPost";
						newPost.appendChild(document.createTextNode(postTitle));
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
						console.log(error)
					}
				}).catch(error => {
					console.log(error)
				})
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
			let contentTextField = document.getElementById("typeFieldReply").value
			// If the user typed something as a reply
			if (contentTextField != ""){
				const url = '/forum/post/' + everyPost[postIndex]._id 
				let data = {
					creator: currentUser._id,
					content: document.getElementById("typeFieldReply").value
				}
				const request = new Request(url, {
					method: 'post',
					body: JSON.stringify(data),
					headers: {
						'Accept': 'application/json, text/plain, */*',
			            'Content-Type': 'application/json'
					}
				});

				fetch(request).then((res, error) => {
					if(res.status === 200){
						mainContent.innerHTML += `
							<div id='displayPost'>
								<div class="postRow">
									<img class="postImage" src=${currentUser.profileImage}>
									<div class="postAuthorContainer">
										${currentUser.username}
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
						`;
					} else {
						console.log(error);
					}
				}).catch(error => {
					console.log(error);
				})
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
		const forumUrl = '/forum/allPost';
		fetch(forumUrl).then((res, error) => {
			if(res.status === 200){
				return res.json()
			} else {
				res.status(404).send(error)
			}
		}).then(json => {
			if(json.length != 0){
				everyPost = json;
			}
		}).catch(error => {
			console.log(error)
		})
		if(currentSearch != ""){
			for (let i = 0; i <= everyPost.length - 1; i++) {
				// Hide the ones that does not fit the search, display the ones that are searched.
				let searching = everyPost[i].title.toUpperCase()
				if (searching.includes(currentSearch) === true) {
					postSection.children[3+(everyPost.length - i - 1)].style.display = "";
				}
				else {
					postSection.children[3+(everyPost.length - i - 1)].style.display = "none";
				}
			}
		} else {
			for (let i = 3; i < postSection.children.length; i++) {
				postSection.children[i].style.display = "";
			}
		}
	}
