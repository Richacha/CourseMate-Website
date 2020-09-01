'user strict'
// this is a page to show all study groups. users 

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
	}
}

const users = [];
// the user who is currently logging in.
let currentUser = null;
// a hardcoding sample.
// TODO in phase2: ask users and groups data from server.
users.push(new User("123", "123"));
users.push(new User("234", "234"));
users.push(new User("345", "345"));

groups = [];

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

for(let i = 0; i < groups.length; i++){
	createGroupElement(groups[i]);
}
groupMenu.innerHTML = `${groups.length} groups in total`;

function createGroupElement(group){
	let groupEle = document.createElement("div")
	groupEle.className = "groupElement";

	// A hard coded example that demonstrate the groupPage with a link on the group name
	if (group.name == "Happy 309 friends"){
		groupEle.innerHTML = `<span class="groupCourse">${group.course}</span>:<a href="../groupPage/groupPage.html"> <span class="groupName"> ${group.name}</span></a>
						   <span class="memberNum">${group.members.length} members</span>`
	}
	else{
		groupEle.innerHTML = `<span class="groupCourse">${group.course}</span>: <span class="groupName">${group.name}</span>
						   <span class="memberNum">${group.members.length} members</span>`
	}
	
	groupTable.appendChild(groupEle);
	// TODO in phase2: join the group based on groups data from server and jump into the corresponding group page.
	// groupEle.addEventListener("click", join);
}

function join(e){
	e.preventDefault();
	let course = e.target.children[0].innerText;
	let groupName = e.target.children[1].innerText;
	// TODO in phase2: join the group based on groups data from server and jump into the corresponding group page.
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
	size = 0;
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

// -------------------new group functionality -----------------------
let newGroup = document.querySelector("#newGroupButton");
newGroup.addEventListener("click", createGroup);

function createGroup(e){
	e.preventDefault();
	let course = document.querySelector("#newCourseNum").value;
	let groupName = document.querySelector("#newGroupName").value;
	let group = new Group(groupName, course, [currentUser]);
	console.log(course);
	console.log(groupName);
	let groupEle = createGroupElement(group);
	groups.push(group);
	groupMenu.innerHTML = `${groups.length} groups in total`;
	// TODO in phase2: sends new group data to server.
	// the user also should directly get into the group page.

	
}