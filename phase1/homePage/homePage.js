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



// ------------ drop down menu ------------------
// After the user logs in, username will be shown on the position of initial log in button.
// The user can click his username to open a drop down menu.


function showDropDown(e) {
 	e.preventDefault();
  	let dropDown = document.querySelector("#dropDown");
	dropDown.className = "dropDownShown";
	window.addEventListener("click", hideDropDown);
 }

 function hideDropDown(e){
 	e.preventDefault();
 	if (e.target.id === "dropDown" || e.target.id === "logIn"){
 		return;
 	}
  	let dropDown = document.querySelector("#dropDown");
	dropDown.className = "dropDown";
	window.removeEventListener("click", hideDropDown);
 }



//-------------log off functionality ------------------
let logOff = document.querySelector("#logOff");
logOff.addEventListener("click", logOffProcess);

function logOffProcess(){
	currentUser = null;
	let logIn = document.querySelector("#logIn");
	logIn.innerHTML = `Log In`;
	logIn.removeEventListener("click", showDropDown);
	logIn.addEventListener("click", logInPage);
}