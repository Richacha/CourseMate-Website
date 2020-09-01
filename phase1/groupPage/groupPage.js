"use strict"

class Group{
	constructor(name, course, members){
		this.name = name;
		this.course = course;
		this.members = members;
	}
	addMember(user){
		this.members.push(user);
	}
}


class User {
	constructor(username, password, avatar){
		this.username = username;
		// password is temporarily choice
		this.password = password;
		this.avatar = avatar;
		this.groups = [];
	}

	joinGroup(group){
		this.groups.push(group);
	}
}


class Announcement{
	constructor(title, content){
		this.title = title
		this.content = content;
	}
}

// TODO in phase2: receive group and user data from server.
const announcements = [new Announcement("2018-11-5 19:00 Haolin Zhang", "Welcome to Happy 309 friends!!!"),
		 new Announcement("2018-11-5 19:20 Haolin Zhang", "Let's hold the first meeting at BA2200 tomorrow at 10:00."),
		 new Announcement("2018-11-6 7:00 Bob Lin", "Prof has already released Exercise 3!!!"),
		 new Announcement("2018-11-6 13:00 Haolin Zhang", "I got some questions about node.js, can someone help me?"),
		 new Announcement("2018-11-7 9:00 Feng Xie", "@Haolin Zhang, no problem man. I am in RB, come and find me."),
		 new Announcement("2018-11-7 15:00 Bob Lin", "Let's have the last meeting before project phase 1."),
		 new Announcement("2018-11-7 16:00 Bob Lin", "Time: tomorrow at 11:00. Location: BA2210.")];


const users = [];
// a hardcoding sample.
users.push(new User("Haolin Zhang", "123", "uoft.jpg"));
users.push(new User("Bob Lin", "234", "uoft.jpg"));
users.push(new User("Feng Xie", "345", "uoft.jpg"));

// the user who is currently logging in.
let currentUser = users[0];

const messages = [
	  {sender: users[2], message: "Hello World."},
      {sender: currentUser, message: "Hello JS."}]

const currentGroup = new Group("Happy 309 friends", "CSC309", []);

for(let i = 0; i < 3; i++){
	currentGroup.addMember(users[i]);
	users[i].joinGroup(currentGroup);
}
showGroup(currentGroup);

const announcement = document.querySelector("#announcement");
announcement.addEventListener("click", showAnnouncement);


// show the whole page based on the current group
function showGroup(group){
	let groupName = document.querySelector("#groupName");
	groupName.appendChild(document.createTextNode(currentGroup.name));

	let members = document.querySelector("#members");
	for(let i = 0; i < currentGroup.members.length; i++){
		let member = document.createElement("li");
		member.className = "groupMember";
		// if user clicks one name, the page should jump to profile. Needs further back-end operation.
		let memberName = document.createTextNode(currentGroup.members[i].username);
		member.appendChild(memberName);
		members.appendChild(member);
		members.addEventListener("click", showProfile);
	}
}


function showProfile(e){
	e.preventDefault();
	// needs further implementation
	window.location.href = "../userInfoDisplay/userInfoDisplay.html"
}

const main = document.querySelector("#mainContent");

// -----------------------show announcement-------------------------
function showAnnouncement(e){
	e.preventDefault();
	main.innerHTML =
	`
	<div id = "contentTitle">
        Announcement
        <span id="newAnnouncement">
            + new
        </span>
    </div>
    <ul id="announcementList">
    </ul>
	`
	const announList = document.querySelector("#announcementList");
	for(let i = 0; i < announcements.length; i++){
		let newAnnounce = newAnnouncementElement(announcements[i]);
		announList.appendChild(newAnnounce);
	}
	let newAn = document.querySelector("#newAnnouncement");
	newAn.addEventListener("click", createNewAnnouncementPage);
}


// ---------------------- new announcement -------------------------

function newAnnouncementElement(announcement){
	let newEle = document.createElement("li");
	newEle.className = "announcementElement"
	newEle.innerHTML = `
            <div class = "announcementElementTitle">${announcement.title}</div>
            <div class = "announcementElementContent">${announcement.content}</div>`
    return newEle;
}


function createNewAnnouncementPage(e){
	e.preventDefault();
	const announList = document.querySelector("#announcementList");
	announList.innerHTML =
	`
	    <form id = "newForm">
        <div class = "formElement">
        Title: </br><input class="textInput" type="text" name="title" placeholder="title" id="title"/>
        </div>
        </br>
        <div class="formElement">
        Content: </br><textarea class="textInput" name="Ancontent" placeholder="content" id="anContent"
        rows = 15 cols = 100></textarea>
        </div>
        </br>
        <button id="newAnButton" class="button"/>Submit</button>
        </form>
	`
	let newAn = document.querySelector("#newAnButton");
	newAn.addEventListener("click", submitNewAn);
}


function submitNewAn(e){
	const announList = document.querySelector("#announcementList");
	e.preventDefault();
	let title = document.querySelector("#title").value;
	let content = document.querySelector("#anContent").value;
	let an = new Announcement(title, content);
	announcements.push(an);
	announList.innerHTML = ``;
for(let i = 0; i < announcements.length; i++){
	let newAnnounce = newAnnouncementElement(announcements[i]);
	announList.appendChild(newAnnounce);
}
}


// --------------------group chat function-------------------

const groupChat = document.querySelector("#groupChat");
groupChat.addEventListener("click", showGroupChat);

function showGroupChat(e){
	e.preventDefault();
	main.innerHTML =
	`
	<div id = "contentTitle">
        Group Chat
    </div>
	</div>
	<div id="chatingMessages" class="visibleContainer">
	</div>
	<div id="sendingTextContainer" class="visibleContainer">
        <textarea id="sendingTextArea" placeholder="Send a message"></textarea>
        <button id="sendingTextButton" type="button" class="btn btn-sm">Send</button>
    </div>
	`
	showHistory();
	let sendingTextButton = document.querySelector("#sendingTextButton");
	sendingTextButton.addEventListener("click", sendMsg);
}


function showHistory(){
	if (messages === null) {
	    return;
	  }
	let container = document.querySelector("#chatingMessages");
	for (let i = 0; i < messages.length; i++) {
		addMsg(messages[i]);
	}
}


function addMsg(message){
	let container = document.querySelector("#chatingMessages");
	let chatRow = document.createElement("div");
	chatRow.className = "chatRow";
    if (message.sender !== currentUser) {
    	chatRow.innerHTML = `
          <img class="chatLeftImage" src=${message.sender.avatar}>
          <div class="leftOneMessageContainer"><br>
            <div class="oneMessage">
              ${message.message}
            </div>
          </div>
    	`
    } else {
    	// current user
    	chatRow.innerHTML = `
          <img class="chatRightImage" src=${message.sender.avatar}>
          <div class="rightOneMessageContainer"><br>
            <div class="oneMessage">
              ${message.message}
            </div>
          </div>
    	`
    }
    container.appendChild(chatRow);
}

function sendMsg(e){
	e.preventDefault();
	let content = document.querySelector("#sendingTextArea").value;
	let msg = {sender: currentUser, message: content};
	messages.push(msg);
	addMsg(msg);
}


//----------------- join group---------------------------------
let joinGroupButton = document.querySelector("#joinGroup");
joinGroupButton.addEventListener("click", joinGroup);

function joinGroup(e){
	e.preventDefault();
	alert("You have joined the group successfully!");
	//TODO in phase2: send new data to server
}


//----------------- leave group---------------------------------
let leaveGroupButton = document.querySelector("#leaveGroup");
leaveGroupButton.addEventListener("click", leaveGroup);

function leaveGroup(e){
	e.preventDefault();
	currentGroup.members = currentGroup.members.filter(function(user){return user != currentUser;});
	currentUser.groups = currentUser.groups.filter(function(group){return group != currentGroup});
	//TODO in phase2: send new data to server
	// Also, if a group has no member anymore, then it will be deleted automatically
	window.location.href = "../studyGroup/studyGroup.html";
}
