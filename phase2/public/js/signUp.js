'user strict'


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
	let newUser = {"username": username, "password": password};

    const request = new Request("/users/signUp", {
    method: 'post', 
    body: JSON.stringify(newUser),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
	});
    fetch(request).then(function(res) {
        const message = document.querySelector('#message')
        if (res.status === 200) {
           	window.location.href="/avatar/webpage"
        } else {
            let signUpMsg = createContainerElement();
			let text = document.createTextNode("Unable to sign up");
			signUpMsg.appendChild(text);
			if (form.children.length === 3){
				form.appendChild(signUpMsg);
			} else {
				form.removeChild(form.lastChild);
				form.appendChild(signUpMsg);
			}
			return null;
        }
    }).catch((error) => {
        console.log(error)
    })
	//resourse: https://stackoverflow.com/questions/2906582/how-to-create-an-html-button-that-acts-like-a-link
}