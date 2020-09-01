'user strict'

let posts = [];
let users = [];
// the user who is currently logging in.
let currentUser = null;
let groups = [];

let groupTable = document.querySelector("#groupTable");
let groupMenu = document.querySelector("#groupMenu");
let userTable = document.querySelector("#userTable");
let userMenu = document.querySelector("#userMenu");
let postTable = document.querySelector("#postTable");
let postMenu = document.querySelector("#postMenu");

for(let i = 0; i < groups.length; i++){
	createGroupElement(groups[i]);
}
groupMenu.innerHTML = `${groups.length} groups in total`;


const userUrl = '/forum/allUser';
fetch(userUrl).then((res, error) => {
	if(res.status === 200){
		return res.json()
	} else {
		res.status(404).send(error)
	}
}).then(json => {
	allUsers = json
	users = allUsers.slice()
	for(let i = 0; i < allUsers.length; i++){
	createUserElement(allUsers[i]);
	}
	userMenu.innerHTML = `${allUsers.length} users in total`;

}).catch(error => {
	console.log(error)
})

const groupUrl = '/groups';
fetch(groupUrl).then((res, error) => {
	if(res.status === 200){
		return res.json()
	} else {
		res.status(404).send(error)
	}
}).then(json => {
	allGroups = json
	groups = allGroups.slice()
	for(let i = 0; i < allGroups.length; i++){
		createGroupElement(allGroups[i]);
	}
	groupMenu.innerHTML = `${allGroups.length} groups in total`;

}).catch(error => {
	console.log(error)
})

const postUrl = '/forum/allPost';
fetch(postUrl).then((res, error) => {
	if(res.status === 200){
		return res.json()
	} else {
		res.status(404).send(error)
	}
}).then(json => {
	allPosts = json
	posts = allPosts.slice()
	for(let i = 0; i < allPosts.length; i++){
		createPostElement(allPosts[i]);
	}
	postMenu.innerHTML = `${allPosts.length} posts in total`;

}).catch(error => {
	console.log(error)
})



function createGroupElement(group){
	let groupEle = document.createElement("div")
	groupEle.className = "groupElement";
	groupEle.innerHTML = `<span class="groupCourse">${group.courseCode}</span>: <span class="groupName">${group.groupName}</span>
						   <span class="memberNum">${group.members.length} members</span>
						   <span><button class="removeGroup" OnClick=" location.href='/admin/webpage' ">Remove</button></span>`
	groupTable.appendChild(groupEle);
}

function createUserElement(user){
	let userEle = document.createElement("div")
	userEle.className = "userElement";
	userEle.innerHTML = `<span class="groupCourse"></span> <span class="groupName">${user.username}</span>
					     <span><button class="removeUser" OnClick=" location.href='/admin/webpage' ">Remove</button></span>`
	userTable.appendChild(userEle);
}

function createPostElement(post){
	let postEle = document.createElement("div")
	postEle.className = "postElement";
	postEle.innerHTML = `<span class="groupCourse">${post._id}</span>: <span class="groupName">${post.title}</span>
						 <span><button class="removePost" OnClick=" location.href='/admin/webpage' ">Remove</button></span>`
	postTable.appendChild(postEle);
}

let removeButtonG = document.querySelector("#groupTable");
removeButtonG.addEventListener("click", removeGroup);
let removeButtonU = document.querySelector("#userTable");
removeButtonU.addEventListener("click", removeUser);
let removeButtonP = document.querySelector("#postTable");
removeButtonP.addEventListener("click", removePost);

function removeGroup(e){
	e.preventDefault();
	if (e.target.className == 'removeGroup'){
		let unWantedRow = e.target.parentNode.parentNode;
		index = Array.prototype.indexOf.call( e.target.parentElement.parentElement.parentElement.children, e.target.parentElement.parentElement)
		unWantedRow.parentNode.removeChild(unWantedRow);

		url = '/admin/deleteStudyGroup/' + groups[index-1]._id
		const request = new Request(url, {
			method: 'DELETE',
			body: JSON.stringify({}),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		});
		fetch(request)
		.then(function(res) {
		}).catch((error) => {
			console.log(error)
		})
		groupMenu.innerHTML = `${groups.length} groups in total`;
	}
}


function removeUser(e){
	e.preventDefault();
	if (e.target.className == 'removeUser'){
		let unWantedRow = e.target.parentNode.parentNode;
		index = Array.prototype.indexOf.call( e.target.parentElement.parentElement.parentElement.children, e.target.parentElement.parentElement)
		unWantedRow.parentNode.removeChild(unWantedRow);
		let userUrl = '/admin/deleteUser/' + users[index-1]._id
		const request = new Request(userUrl, {
			method: 'DELETE',
			body: JSON.stringify({}),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		});
		fetch(request)
		.then(function(res) {
		}).catch((error) => {
			console.log(error)
		})
		userMenu.innerHTML = `${users.length} users in total`;
	}
}

function removePost(e){
	e.preventDefault();
	if (e.target.className == 'removePost'){
		let unWantedRow = e.target.parentNode.parentNode;
		index = Array.prototype.indexOf.call( e.target.parentElement.parentElement.parentElement.children, e.target.parentElement.parentElement)
		unWantedRow.parentNode.removeChild(unWantedRow);
		url = '/admin/deletePost/' + posts[index-1]._id
		const request = new Request(url, {
			method: 'DELETE',
			body: JSON.stringify({}),
			headers: {
				'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json'
			},
		});
		fetch(request)
		.then(function(res) {
		}).catch((error) => {
			console.log(error)
		})
		postMenu.innerHTML = `${posts.length} posts in total`;

	}
}

//------------------search functionality-------------------------------


let searchGButton = document.querySelector("#searchGButton");
searchGButton.addEventListener("click", searchGroup);
let searchUButton = document.querySelector("#searchUButton");
searchUButton.addEventListener("click", searchUser);
let searchPButton = document.querySelector("#searchPButton");
searchPButton.addEventListener("click", searchPost);


function searchGroup(e){
	e.preventDefault();
	let course = document.querySelector("#courseNum").value;
	let groupName = document.querySelector("#groupName").value;
	// empty the table
	while (groupTable.hasChildNodes()){
		groupTable.removeChild(groupTable.firstChild);
	}
	groupTable.appendChild(groupMenu);
	let size = 0;
	for(let i = 0; i < groups.length; i++){
		if (
		 	groups[i].courseCode.includes(course) &&
		 	groups[i].groupName.includes(groupName)){
				createGroupElement(groups[i]);
				size ++;
	}
	groupMenu.innerHTML = `${size} groups in total`;
	}
}

function searchUser(e){
	e.preventDefault();
	let username = document.querySelector("#username").value;
	// empty the table
	while (userTable.hasChildNodes()){
		userTable.removeChild(userTable.firstChild);
	}
	let size = 0;
	userTable.appendChild(userMenu);
	for(let i = 0; i < users.length; i++){
		if (
		 	(username !== "" && users[i].username.includes(username)) ||
			 (username === "")){
				createUserElement(users[i]);
				size ++;
	}
	userMenu.innerHTML = `${size} users in total`;
	}
}


function searchPost(e){
	e.preventDefault();
	let identifier = document.querySelector("#identifier").value;
	let postTitle = document.querySelector("#postTitle").value;
	// empty the table
	while (postTable.hasChildNodes()){
		postTable.removeChild(postTable.firstChild);
	}
	postTable.appendChild(postMenu);
	let size = 0;
	for(let i = 0; i < posts.length; i++){
		if (posts[i]._id == parseInt(identifier) ||
		 	(postTitle !== "" && posts[i].title.includes(postTitle)) ||
		 	(identifier == "" && postTitle == "")){
				createPostElement(posts[i]);
				size ++;
	}
	postMenu.innerHTML = `${size} posts in total`;
	}
}
