'user strict'

let users = [];
// the user who is currently logging in.
let currentUser = null;


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