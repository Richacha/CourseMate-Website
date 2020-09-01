'user strict'
// this is a temporary user class.
// TODO in phase2: receive all user data from server.
class User {
	constructor(username, password){
		this.username = username;
		this.password = password;
	}
}

// a hardcoding sample.
const users = [];
users.push(new User("123", "123"));


// administrater
users.push(new User("admin", "admin"));


function createContainerElement(){
	let ele = document.createElement("div")
	ele.className - "createContainerElement";
	return ele;
}


let logInButton = document.querySelector("#logInButton");
logInButton.addEventListener("click", logInProcess);

function logInProcess(e){
	e.preventDefault();
	let logInInfo = document.querySelectorAll("#logInInfo .textInput");
	let form = document.querySelector("#logInInfo");
	let username = logInInfo[0].value;
	let password = logInInfo[1].value;
	if (username === "admin" && password === "admin"){
		// enter admin page
		window.location.href = "../admin/admin.html"
		return;
	}
	for(let i = 0; i < users.length; i++){
		if (users[i].username === username){
			if (users[i].password === password){
				//TODO in phase2: sends current user to server.

				// then directly jump to forum page.
				//resourse: https://stackoverflow.com/questions/2906582/how-to-create-an-html-button-that-acts-like-a-link
				window.location.href="../forum/forum.html"
				return;
			}
		}
	}
	// length === 3: already has a msg.
	if (form.children.length === 3){
		let logInMsg = createContainerElement();
		let text = document.createTextNode("Invalid username or password.");
		logInMsg.appendChild(text);
		form.appendChild(logInMsg);
	}
}