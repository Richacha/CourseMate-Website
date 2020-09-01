'user strict'

class Group{
	constructor(name, course, members){
		this.name = name;
		this.course = course;
		this.members = members;
	}
}


class User {
	constructor(username, password){
		this.username = username;
		// password is temporarily choice
		this.password = password;
		this.id = users.length;
	}
}

// This is the class representing an entire post, including title, user, content, and the responses of the post.
let numOfPosts = 0;
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

let posts = [];
// TODO in phase2: obtain all data from server.
posts.push(new Post("Dimitri", "Anyone knows the average for RSM223 midterm yet?", "", [], "../friendList/15.jpg"));
posts.push(new Post("Alice", "ECO101 is too hard!", "Why is this course so hard?", [], "../friendList/3.jpg"));
posts.push(new Post("Kevin", "Hi, need some help for csc148", "Hi, I'm struggling with reviewing for midterm, could use some help", [], "../friendList/2.jpg"));
posts.push(new Post("Adm", "Want a teammate for csc500", "Hi, I'm looking for a partner for csc500 project2", [], "../friendList/0.jpg"));
posts.push(new Post("Mark", "Looking for teammate in course CSC309", "Hi, we are looking for a teammate for CSC309, contact me via my email: demo.mark@utoronto.ca", [], "../friendList/1.jpg"));

let users = [];
// the user who is currently logging in.
let currentUser = null;
// a hardcoding sample.
users.push(new User("Sam", "123"));
users.push(new User("Richard", "234"));
users.push(new User("Mark", "345"));

let groups = [];

groups.push(new Group("Happy 309 friends", "CSC309", [users[0], users[1], users[2]]));
groups.push(new Group("Hawk", "CSC373", [users[0], users[1]]));
groups.push(new Group("Batman", "CSC108", [users[1], users[2]]));
groups.push(new Group("Duedue", "CSC207", [users[0]]));
groups.push(new Group("Tiger", "CSC404", [users[0], users[2]]));
groups.push(new Group("NoError", "CSC369", [users[1], users[2]]));
groups.push(new Group("Compiler", "CSC373", [users[0], users[1]]));
groups.push(new Group("Orange", "CSC309", [users[0], users[1], users[2]]));
groups.push(new Group("CUA", "CSC108", [users[1], users[2]]));
groups.push(new Group("Pass", "CSC207", [users[0]]));
groups.push(new Group("YYC", "CSC404", [users[0], users[2]]));
groups.push(new Group("Burger", "CSC369", [users[1], users[2]]));
groups.push(new Group("New", "CSC373", [users[0], users[1]]));
groups.push(new Group("Rock", "CSC309", [users[0], users[1], users[2]]));
groups.push(new Group("Sandwich", "CSC108", [users[1], users[2]]));
groups.push(new Group("Stars", "CSC207", [users[0]]));
groups.push(new Group("YoBuddy", "CSC404", [users[0], users[2]]));
groups.push(new Group("Elf", "CSC369", [users[1], users[2]]));
groups.push(new Group("GG", "CSC373", [users[0], users[1]]));
groups.push(new Group("Midterm1", "CSC309", [users[0], users[1], users[2]]));
groups.push(new Group("StayUpLate", "CSC108", [users[1], users[2]]));
groups.push(new Group("Water", "CSC207", [users[0]]));
groups.push(new Group("Party", "CSC404", [users[0], users[2]]));
groups.push(new Group("OMG", "CSC369", [users[1], users[2]]));

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

for(let i = 0; i < users.length; i++){
	createUserElement(users[i]);
}
userMenu.innerHTML = `${users.length} users in total`;

for(let i = 0; i < posts.length; i++){
	createPostElement(posts[i]);
}
postMenu.innerHTML = `${posts.length} posts in total`;


function createGroupElement(group){
	let groupEle = document.createElement("div")
	groupEle.className = "groupElement";
	groupEle.innerHTML = `<span class="groupCourse">${group.course}</span>: <span class="groupName">${group.name}</span>
						   <span class="memberNum">${group.members.length} members</span>
						   <span><button class="removeGroup">Remove</button></span>`
	groupTable.appendChild(groupEle);
}

function createUserElement(user){
	let userEle = document.createElement("div")
	userEle.className = "userElement";
	userEle.innerHTML = `<span class="groupCourse">${user.id}</span>: <span class="groupName">${user.username}</span>
					     <span><button class="removeUser">Remove</button></span>`
	userTable.appendChild(userEle);
}

function createPostElement(post){
	let postEle = document.createElement("div")
	postEle.className = "postElement";
	postEle.innerHTML = `<span class="groupCourse">${post.identifier}</span>: <span class="groupName">${post.postTitle}</span>
						 <span><button class="removePost">Remove</button></span>`
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
		let course = unWantedRow.children[0].innerText;
		let name = unWantedRow.children[1].innerText;
		for(let i = 0; i < groups.length; i++){
			groups = groups.filter(function(group){return group.name !== name || group.course !== course});
		}
		unWantedRow.parentNode.removeChild(unWantedRow);
		groupMenu.innerHTML = `${groups.length} groups in total`;
	}
	// TODO phase 2: update the group list to the server.
}


function removeUser(e){
	e.preventDefault();
	if (e.target.className == 'removeUser'){
		let unWantedRow = e.target.parentNode.parentNode;
		let id = parseInt(unWantedRow.children[0].innerText);
		let name = unWantedRow.children[1].innerText;
		for(let i = 0; i < groups.length; i++){
			users = users.filter(function(user){return user.username !== name || user.id !== id});
		}
		unWantedRow.parentNode.removeChild(unWantedRow);
		userMenu.innerHTML = `${users.length} users in total`;
	}
	// TODO phase 2: update the user list to the server.
}

function removePost(e){
	e.preventDefault();
	if (e.target.className == 'removePost'){
		let unWantedRow = e.target.parentNode.parentNode;
		let identifier = parseInt(unWantedRow.children[0].innerText);
		let postTitle = unWantedRow.children[1].innerText;
		for(let i = 0; i < groups.length; i++){
			posts = posts.filter(function(post){return post.postTitle !== postTitle || post.identifier !== identifier});
		}
		unWantedRow.parentNode.removeChild(unWantedRow);
		postMenu.innerHTML = `${posts.length} posts in total`;
	}
	// TODO phase 2: update the post list to the server.
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
		 	groups[i].course.includes(course) &&
		 	groups[i].name.includes(groupName)){
				createGroupElement(groups[i]);
				size ++;
	}
	groupMenu.innerHTML = `${size} groups in total`;
	}
}

function searchUser(e){
	e.preventDefault();
	let userID = document.querySelector("#userID").value;
	let username = document.querySelector("#username").value;
	// empty the table
	while (userTable.hasChildNodes()){
		userTable.removeChild(userTable.firstChild);
	}
	let size = 0;
	userTable.appendChild(userMenu);
	for(let i = 0; i < users.length; i++){
		if (
		 	users[i].id == parseInt(userID) ||
		 	(username !== "" && users[i].username.includes(username)) ||
		 	(userID === "" && username === "")){
				console.log(users[i])
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
		if (posts[i].identifier == parseInt(identifier) ||
		 	(postTitle !== "" && posts[i].postTitle.includes(postTitle)) ||
		 	(identifier == "" && postTitle == "")){
				createPostElement(posts[i]);
				size ++;
	}
	postMenu.innerHTML = `${size} posts in total`;
	}
}
