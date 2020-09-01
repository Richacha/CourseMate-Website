"use strict"
const imgs = document.querySelectorAll(".avatar")
for (let i = 0; i < imgs.length; i++){
	imgs[i].addEventListener("click", chooseAvatar)
}

let currentUser = null;
const url = '/profile/userinfo';
	fetch(url)
	.then((res) => { 
	if (res.status === 200) {
		return res.json() 
	} else {
		alert('Could not get cur user')
	}}).then((json) => {
		currentUser = json.user
		}).catch((error) => {
		console.log(error)
	})


function chooseAvatar(e){
	e.preventDefault();
	currentUser.profileImage = e.target.id;
	const request = new Request("/profile/update", {
    method: 'PATCH', 
    body: JSON.stringify(currentUser),
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
	});
    fetch(request).then(function(res) {
        if (res.status === 200) {
           	window.location.href="/profile/webpage"
        } else {
        	console.log("error")
			}
			return null;
    }).catch((error) => {
        console.log(error)
    })
}