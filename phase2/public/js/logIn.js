'user strict'

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

	let logInUser = {"username": username, "password": password}
	if (username === "admin" && password === "admin"){
		window.location.href = "/admin/webpage"
	}
	const request = new Request("/users/login", {
    method: 'post', 
    body: JSON.stringify(logInUser),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
	});
    fetch(request).then(function(res) {
        const message = document.querySelector('#message')
        if (res.status === 200) {
           	window.location.href="/profile/webpage"
        } else {
            let logInMsg = createContainerElement();
			let text = document.createTextNode("Unable to log in");
			logInMsg.appendChild(text);
			if (form.children.length === 3){
				form.appendChild(logInMsg);
			} else {
				form.removeChild(form.lastChild);
				form.appendChild(logInMsg);
			}
			return null;
        }
    }).catch((error) => {
        console.log(error)
    })
}