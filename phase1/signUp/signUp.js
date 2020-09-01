'user strict'
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
users.push(new User("123", "123"));


let signUpButton = document.querySelector("#signUpButton");
signUpButton.addEventListener("click", signUpProcess);


function createContainerElement(){
	let ele = document.createElement("div")
	ele.className - "containerElement";
	return ele;
}

function signUpProcess(e){
	e.preventDefault();
	let signUpInfo = document.querySelectorAll("#signUpInfo .textInput");
	let form = document.querySelector("#signUpInfo");
	let username = signUpInfo[0].value;
	let password = signUpInfo[1].value;
	if (username.length >= 10){
		let signUpMsg = createContainerElement();
		let text = document.createTextNode("Username has maximum length 9");
		signUpMsg.appendChild(text);
		if (form.children.length === 3){
				form.appendChild(signUpMsg);
		} else {
				form.removeChild(form.lastChild);
				form.appendChild(signUpMsg);
		}
		return null;
	}
	if (username.length === 0 || password.length === 0){
		let signUpMsg = createContainerElement();
		let text = document.createTextNode("Username and password cannot be empty");
		signUpMsg.appendChild(text);
		if (form.children.length === 3){
				form.appendChild(signUpMsg);
		} else {
				form.removeChild(form.lastChild);
				form.appendChild(signUpMsg);
		}
		return null;
	}
	for(let i = 0; i < users.length; i++){
		if (users[i].username === username){
			let signUpMsg = createContainerElement();
			let text = document.createTextNode("Username has been used");
			signUpMsg.appendChild(text);
			if (form.children.length === 3){
				form.appendChild(signUpMsg);
			} else {
				form.removeChild(form.lastChild);
				form.appendChild(signUpMsg);
			}
			return null;
		}
	}
	let newUser = new User(username, password);
	users.push(newUser);
	//resourse: https://stackoverflow.com/questions/2906582/how-to-create-an-html-button-that-acts-like-a-link
	window.location.href="../homePage/homePage.html"
}