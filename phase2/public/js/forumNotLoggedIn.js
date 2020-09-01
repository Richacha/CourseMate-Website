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
