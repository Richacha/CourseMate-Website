'use strict'
// this is a page to show all study groups. 

let groupTable = document.querySelector("#groupTable");
let groupMenu = document.querySelector("#groupMenu");
let curUser = null;
let groups = [];
refresh();
getCurUser();

function refresh(){
	const url = '/groups';
	fetch(url)
	.then((res) => { 
	if (res.status === 200) {
		return res.json() 
	} else {
		alert('Could not get groups')
	}}).then((json) => {
		for (let i = 0; i < json.length; i++){
			if (groups.filter((ele) => {return ele._id === json[i]._id}).length === 0){
				createGroupElement(json[i]);
				groups.push(json[i])
				}
			}
		groupMenu.innerHTML = `${groups.length} groups in total`
		}).catch((error) => {
		console.log(error)
	})
}
function createGroupElement(group){
	let groupEle = document.createElement("div")
	groupEle.className = "groupElement";
	groupEle.id = group._id
	groupEle.addEventListener("click", findGroup)
	groupEle.innerHTML = `<span class="groupCourse">${group.courseCode}</span>: <span class="groupName">${group.groupName}</span>
						   <span class="memberNum">${group.members.length} members</span>`
	
	groupTable.appendChild(groupEle);
}

function findGroup(e){
	let target = e.target
	if (target.nodeName !== "DIV"){
		target = target.parentElement
	}
	let data = {id : target.id}
	const request = new Request('/groups/group', {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        const message = document.querySelector('#message')
        if (res.status === 200) {
            window.location.href = "/groupPage/webPage"
        } else {
            alert("Unable to add a new group")
     
        }
    }).catch((error) => {
        console.log(error)
    })
}



//------------------search functionality-------------------------------


let searchButton = document.querySelector("#searchButton");
searchButton.addEventListener("click", search);


function search(e){
	e.preventDefault();
	let course = document.querySelector("#courseNum").value;
	let groupName = document.querySelector("#groupName").value;
	// empty the table
	while (groupTable.hasChildNodes()){
		groupTable.removeChild(groupTable.firstChild);
	}
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

// -------------------new group functionality -----------------------
let newGroup = document.querySelector("#newGroupButton");
newGroup.addEventListener("click", createGroup);

function createGroup(e){
	e.preventDefault();
	let course = document.querySelector("#newCourseNum").value;
	let groupName = document.querySelector("#newGroupName").value;
	let group = {groupName: groupName, courseCode: course};
	
	const request = new Request('/groups', {
        method: 'post', 
        body: JSON.stringify(group),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        const message = document.querySelector('#message')
        if (res.status === 200) {
        	return res;
        } else {
            alert("Unable to add a new group")
     
        }
    }).catch((error) => {
        console.log(error)
    })
	refresh();
}

function getCurUser() {
	const url = '/profile/userinfo';

    fetch(url)
    .then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            alert('Could not get students')
       }                
    })
    .then((json) => {
        curUser = json.user;
    }).catch((error) => {
        console.log(error)
    })
}