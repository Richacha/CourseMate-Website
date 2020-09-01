"use strict";

const announcement = document.querySelector("#announcement");
announcement.addEventListener("click", showAnnouncement);

let memberArr = []
let currentGroup = null;
let currentUser =null;
const url = '/groups/group';

fetch(url)
.then((res) => { 
    if (res.status === 200) {
       return res.json() 
   } else {
        alert('Could not get cur group')
   }                
})
.then((json) => {
   currentGroup = json.group;
   showGroup(currentGroup);
    }).catch((error) => {
    console.log(error)
})



fetch('/profile/userinfo')
.then((res) => {
  if (res.status === 200) {
     return res.json()
 } else {
      alert('Could not get user info')
 }
})
.then((json) => {
  currentUser = json.user
}).catch((error) => {
  console.log(error)
})


// show the whole page based on the current group
function showGroup(group){
	let groupName = document.querySelector("#groupName");
	groupName.appendChild(document.createTextNode(currentGroup.groupName));
	getAllMembers(currentGroup.members);
}

function getAllMembers(members){
	const request = new Request('/groups/members', {
        method: 'post', 
        body: JSON.stringify({members:members}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            return res.json()           
        } else {
     		alert("Cannot find members")
        }
    }).then((json) => {
    	let membersEle = document.querySelector("#members");
		for (let i = 0; i < json.users.length; i++){
			memberArr.push(json.users[i])
			let memberEle = document.createElement("li");
			memberEle.className = "groupMember";
			// if user clicks one name, the page should jump to profile. Needs further back-end operation.
			let memberName = document.createTextNode(json.users[i].username);
			memberEle.appendChild(memberName);
			membersEle.appendChild(memberEle);
			memberEle.id = json.users[i]._id
			memberEle.addEventListener("click", showProfile);
		}
	}).catch((error) => {
        console.log(error)
    })
}


function showProfile(e){
	e.preventDefault();
	const id = e.target.id
	const request = new Request('/userInfoDisplay/changeUserDisplayedId', {
        method: 'post', 
        body: JSON.stringify({userDisplayedId: id}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            return res.json()           
        } else {
     		alert("Cannot find members")
        }
    }).then((json) => {
    		window.location.href = "/userInfoDisplay/webpage"
	}).catch((error) => {
        console.log(error)
    })
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
	for(let i = 0; i < currentGroup.announcement.length; i++){
		let newAnnounce = newAnnouncementElement(currentGroup.announcement[i]);
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
	let an = {title: title, content: content, sender: currentUser.username};
	currentGroup.announcement.push(an);
	const request = new Request('/groups/update', {
	        method: 'post', 
	        body: JSON.stringify({group: currentGroup}),
	        headers: {
	            'Accept': 'application/json, text/plain, */*',
	            'Content-Type': 'application/json'
	        },
	    });
	    fetch(request)
	    .then(function(res) {
	        if (res.status === 200) {
	            return res.json()           
	        } else {
	     		alert("Cannot update")
	        }
	    }).then((json) => {
	    	alert("succeed")
	    	return json;
		}).catch((error) => {
	        console.log(error)
	    })
	announList.innerHTML = ``;
	for(let i = 0; i < currentGroup.announcement.length; i++){
		let newAnnounce = newAnnouncementElement(currentGroup.announcement[i]);
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
    let messages = currentGroup.groupChat
	if (messages === []) {
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
          <img class="chatLeftImage" src=${message.sender.profileImage}>
          <div class="leftOneMessageContainer"><br>
            <div class="oneMessage">
              ${message.content}
            </div>
          </div>
    	`
    } else {
    	// current user
    	chatRow.innerHTML = `
          <img class="chatRightImage" src=${message.sender.profileImage}>
          <div class="rightOneMessageContainer"><br>
            <div class="oneMessage">
              ${message.content}
            </div>
          </div>
    	`
    }
    container.appendChild(chatRow);
}

function sendMsg(e){
	e.preventDefault();
	let content = document.querySelector("#sendingTextArea").value;
	let msg = {sender: currentUser, content: content};
	currentGroup.groupChat.push(msg);
    const request = new Request('/groups/update', {
        method: 'post', 
        body: JSON.stringify({group: currentGroup}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {

        if (res.status === 200) {
            return res.json()           
        } else {
            alert("Cannot update")
        }
    }).then((json) => {
        return json;
    }).catch((error) => {
        console.log(error)
    })
	addMsg(msg);
}


//----------------- join group---------------------------------
let joinGroupButton = document.querySelector("#joinGroup");
joinGroupButton.addEventListener("click", joinGroup);

function joinGroup(e){
	e.preventDefault();
	if (currentGroup.members.includes(currentUser._id)){
		return null;
	}
	currentGroup.members.push(currentUser._id)
    currentUser.studyGroupList.push(currentGroup)
    let request = new Request("/profile/update", {
    method: 'PATCH', 
    body: JSON.stringify(currentUser),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    });
    fetch(request).then(function(res) {
        if (res.status === 200) {
            return res;
        } else {
            console.log("error")
            }
            return null;
    }).catch((error) => {
        console.log(error)
    })

	request = new Request('/groups/update', {
        method: 'post', 
        body: JSON.stringify({group: currentGroup}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            return res.json()           
        } else {
     		alert("Cannot update")
        }
    }).then((json) => {
    	let membersEle = document.querySelector("#members");
		memberArr.push(currentUser._id)
		let memberEle = document.createElement("li");
		memberEle.className = "groupMember";
		// if user clicks one name, the page should jump to profile. Needs further back-end operation.
		let memberName = document.createTextNode(currentUser.username);
		memberEle.appendChild(memberName);
		membersEle.appendChild(memberEle);
		memberEle.id = currentUser._id
		memberEle.addEventListener("click", showProfile);
	}).catch((error) => {
        console.log(error)
    })
}


//----------------- leave group---------------------------------
let leaveGroupButton = document.querySelector("#leaveGroup");
leaveGroupButton.addEventListener("click", leaveGroup);

function leaveGroup(e){
	e.preventDefault();
	currentGroup.members = currentGroup.members.filter(function(user){
		return user !== currentUser._id;});
    currentUser.studyGroupList = currentUser.studyGroupList.filter(function(group){
        return group._id !== currentGroup._id;
    })
    let request = new Request("/profile/update", {
    method: 'PATCH', 
    body: JSON.stringify(currentUser),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    });
    fetch(request).then(function(res) {
        if (res.status === 200) {
            return res;
        } else {
            console.log("error")
            }
            return null;
    }).catch((error) => {
        console.log(error)
    })
	request = new Request('/groups/update', {
        method: 'post', 
        body: JSON.stringify({group: currentGroup}),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            return res.json()           
        } else {
     		alert("Cannot update")
        }
    }).then((json) => {
    	window.location.href = "/studyGroup/webpage"
	}).catch((error) => {
        console.log(error)
    })
}
