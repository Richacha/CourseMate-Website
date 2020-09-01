'use strict';
const log = console.log;

const express = require('express')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const session = require('express-session')


const { ObjectID } = require('mongodb')

// Import our mongoose connection
const { mongoose } = require('./db/mongoose');

// Import the models
const { User } = require('./models/user')
const { StudyGroup } = require('./models/studyGroup')
const { Post } = require('./models/post')
const { FriendChat } = require('./models/friendChat')

let userDisplayedId = null;



// express
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }))


app.use("/css", express.static(__dirname + '/public/css'))
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/image", express.static(__dirname + '/public/images'))

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}))

// middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('/profile/webpage')
	} else {
		next();
	}
}


// middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/login/webpage')
		})
	} else {
		res.redirect('/login/webpage')
	}
}

// route for root; redirect to login page
app.get('/', sessionChecker, (req, res) => {
		res.sendFile(__dirname + "/public/views/homePage.html")
})

app.get("/curUser", sessionChecker, (req, res) => {
		res.send(req.session.user)
})
// --------------- aboutUs ---------------------------------
app.get("/aboutUs/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/aboutUs.html")})
// --------------- admin ----------------------------------
app.get("/admin/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/admin.html")})
// ------------------- contactUs -------------------------------
app.get("/contactUs/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/contactUs.html")})
// ---------------- forum -----------------------------
app.get('/forum/webpage', (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.sendFile(__dirname + '/public/views/forum.html')
	} else {
		res.sendFile(__dirname + '/public/views/forumNotLoggedIn.html')
	}
})

// ------------------- friendList ----------------------------
app.get('/friendList/webpage', (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.sendFile(__dirname + '/public/views/friendList.html')
	} else {
		res.redirect('/login/webpage')
	}
})


app.get('/friendList/userinfo', (req, res) => {
	const userId = req.session.user
	if (!ObjectID.isValid(userId)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(userId).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}

	}).catch((error) => {
		res.status(400).send(error)
	})
})


// GET user by id
app.get('/friendList/userinfo/:id', (req, res) => {
	const userId = req.params.id
	if (!ObjectID.isValid(userId)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(userId).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}

	}).catch((error) => {
		res.status(400).send(error)
	})
})


// GET users by an array of ids
app.post('/friendList/friends', (req, res) => {
	const listOfId = req.body.list

	for (let i = 0; i < listOfId.length; i++) {
		listOfId[i] = ObjectID(listOfId[i])
	}


	// Otheriwse, findById
	User.find({_id: {$in: listOfId}}).then((users) => {
		res.send(users)

	}).catch((error) => {
		res.status(400).send(error)
	})
})



// Get users who have username
app.get('/friendList/userinfo/:username', (req, res) => {
	const username = req.params.username

	User.find({username: username}).then((users) => {
		res.send(users)
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// Get users who have the same name
app.get('/friendList/userinfo/:firstName/:lastName', (req, res) => {
	const firstName = req.params.firstName;
	const lastName = req.params.lastName;

	User.find({firstName: firstName, lastName: lastName}).then((users) => {
		res.send(users)
	}).catch((error) => {
		res.status(400).send(error)
	})
})

// make friend
app.patch('/friendList/makeFriend/:newFriendId', (req, res) => {

  const currentUserId = req.session.user
	const newFriendId = req.params.newFriendId

	if (!ObjectID.isValid(currentUserId)) {
		res.status(404).send()
	}
	if (!ObjectID.isValid(newFriendId)) {
		res.status(404).send()
	}

	User.findById(currentUserId).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			if (!user.friendList.includes(newFriendId)) {
				user.friendList.push(newFriendId)
				return user.save()
			}
		}
	}).then((result) => {
		return User.findById(newFriendId)
	}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			if (!user.friendList.includes(newFriendId)) {
				user.friendList.push(currentUserId)
				return user.save()
			}
		}
	}).then((result) => {
		const friendChat = new FriendChat({
			chatters: [currentUserId, newFriendId],
			history: []
		})
		return friendChat.save()
	}).then((result) => {
		res.send({})
	}).catch((error) => {
		res.status(400).send(error)
	})

})


// delete friend
app.patch('/friendList/deleteFriend/:oldFriendId', (req, res) => {

  const currentUserId = req.session.user
	const oldFriendId = req.params.oldFriendId
	if (!ObjectID.isValid(currentUserId)) {
		res.status(404).send()
	}
	if (!ObjectID.isValid(oldFriendId)) {
		res.status(404).send()
	}

	User.findById(currentUserId).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			user.friendList.splice(user.friendList.indexOf(oldFriendId), 1);
			return user.save()
		}
	}).then((result) => {
		return User.findById(oldFriendId)
	}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			user.friendList.splice(user.friendList.indexOf(currentUserId), 1);
			return user.save()
		}
	}).then((result) => {
		return FriendChat.deleteOne({chatters: [currentUserId, oldFriendId]})
	}).then((result) => {
		return FriendChat.deleteOne({chatters: [oldFriendId, currentUserId]})
	}).then((result) => {
		res.send({})
	}).catch((error) => {
		res.status(400).send(error)
	})
})



// Get friendChat between two
app.get('/friendList/friendChat/:friendId', (req, res) => {
	const currentUserId = req.session.user
	const friendId = req.params.friendId

	FriendChat.find({chatters: {$in: [[currentUserId, friendId], [friendId, currentUserId]]}}).then((friendChat) => {
		if (friendChat) {
			res.send(friendChat)
		} else {
			res.send({})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})




// POST send message
app.post('/friendList/sendMessage/', (req, res) => {
	const currentUserId = req.session.user
	const friendId = req.body.friendId
	const message = req.body.message

	FriendChat.find({chatters: {$in: [[currentUserId, friendId], [friendId, currentUserId]]}}).then((friendChat) => {
		if (friendChat) {
			friendChat[0].history.push({sender: currentUserId, message: message})
			return friendChat[0].save()
		}
	}).then((result) => {
		res.send({})
	}).catch((error) => {
		res.status(400).send(error)
	})
})










// ------------------------ userInfoDisplay -------------------------------
app.get('/userInfoDisplay/webpage', (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.sendFile(__dirname + '/public/views/userInfoDisplay.html')
	} else {
		res.redirect('/login/webpage')
	}
})


// GET user by id
app.get('/userInfoDisplay/getUserDisplayed', (req, res) => {
	const userId = userDisplayedId

	if (!ObjectID.isValid(userId)) {
		return res.status(404).send()
	}

	// Otheriwse, findById
	User.findById(userId).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}

	}).catch((error) => {
		res.status(400).send(error)
	})
})



app.post('/userInfoDisplay/changeUserDisplayedId', (req, res) => {
	userDisplayedId = req.body.userDisplayedId
	res.send({})
})













// ----------------- groupPage -----------------------------------
app.get("/groupPage/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/groupPage.html")})

app.post("/groups/members", (req, res) => {
	const listOfId = req.body.members
	for (let i = 0; i < listOfId.length; i++){
		listOfId[i] = ObjectID(listOfId[i])
	}
	User.find({_id:{$in: listOfId}}).then((users) => {
		res.send({users: users})
	}).catch((error) => {
		res.status(400).send(error)
	})
})
// ----------------- studyGroup -----------------------------------
app.get("/studyGroup/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/studyGroup.html")})

app.post("/groups/group", (req, res) => {
	req.session.curGroup = req.body.id
	res.send({group: req.session.curGroup})
})

app.get("/groups/group", (req, res) => {
	StudyGroup.findById(req.session.curGroup).then((curGroup) => {
		res.send({group: curGroup})},
		(error) => {res.status(400).send(error)})
})
app.get("/groups", (req, res) => {
	StudyGroup.find().then((studyGroups) => {
		res.send(studyGroups), 
		(error) => {res.status(400).send(error)}
	})
})

app.post("/groups", (req, res) => {
	const courseCode = req.body.courseCode
	const groupName = req.body.groupName

	const newGroup = new StudyGroup({
			groupName: groupName,
			courseCode: courseCode,
			members: [],
  			groupChat: [], 
  			announcement: [],});
	newGroup.save().then((result) =>{
		res.send(result)
	}, (error) => {
		res.status(400).send(error)
	})
})

app.post("/groups/update", (req, res) => {
	const curGroup = req.session.curGroup
	const properties = req.body.group

	if (!ObjectID.isValid(curGroup)) {
		return res.status(404).send()
	}

	// Update 
	StudyGroup.findByIdAndUpdate(curGroup, {$set: properties}, {new: true}).then((result) => {
		if (!result) {
			res.status(404).send()
		} else {
			res.status(200).send({result})
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// -------------------- logIn--------------------------------------
app.get('/login/webpage', sessionChecker, (req, res) => {
		res.sendFile(__dirname + '/public/views/logIn.html')
	})

app.post('/users/login', (req, res) => {

	const username = req.body.username
	const password = req.body.password

	User.findByUsernamePassword(username, password).then((user) => {
		if(!user) {
			res.status(400).send()
		} else {
			req.session.user = user._id;
			req.session.username = user.username
			res.send(user)
		}
	}).catch((error) => {
		res.status(400).send()
	})
})

app.get('/users/logoff', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/login/webpage')
		}
	})
})


// ----------------------- signUp -------------------------------
app.get("/signup/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/signUp.html")})

// user sign up
app.post('/users/signup', (req, res) => {

	// Create a new user
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		firstName: "N/A",
		lastName: "N/A",
		age: "N/A",
		gender: "N/A",
		university: "N/A",
		program: "N/A",
		yearOfStudy: "N/A",
		phoneNumber: "N/A",
		email: "N/A",
		courseList: [],
		studyGroupList: [],
		honour: "N/A",
		hobby: "N/A",
		profileImage: "N/A",
		friendList: []
	})

	for (let i = 0; i < 5; i++) {
		user.courseList.push({courseCode: "N/A", courseName: "N/A", section: "N/A", lecturer: "N/A"})
	}
	user.save().then((result) => {
		req.session.user = result._id
		req.session.username = result.username
		res.send(result)
	}).catch((error) => {
		res.status(400).send(error)
	})

})


// ---------------------- profile ------------------------------

app.get('/profile/webpage', (req, res) => {
	if (req.session.user) {
		res.sendFile(__dirname + '/public/views/profile.html')
	} else {
		res.redirect('/login/webpage')
	}
})



app.get('/profile/userinfo', (req, res) => {
	const userId = req.session.user
	if (!ObjectID.isValid(userId)) {
		return res.status(404).send()
	}
	User.findById(userId).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({ user })
		}

	}).catch((error) => {
		res.status(400).send(error)
	})
})



app.patch('/profile/update', (req, res) => {
	const userId = req.session.user
	const properties = req.body

	if (!ObjectID.isValid(userId)) {
		return res.status(404).send()
	}
	User.findByIdAndUpdate(userId, {$set: properties}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.status(200).send()
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})


//------------------------- Forum --------------------------------
app.get('/forum/allPost', (req, res) => {
	Post.find().then((post) => {
		res.send(post)
	}).catch( (error) => {
		res.status(400).send(error)
	})
})

app.get('/forum/allUser', (req, res) => {
	User.find().then((user) => {
		res.send(user)
	}).catch( (error) => {
		res.status(400).send(error)
	})
})

app.post('/forum/post', (req, res) => {

	const post = new Post({
		title: req.body.title,
		content: req.body.content,
		creator: req.body.creator,
		replies: []
	})

	// save user to database
	post.save().then((result) => {

	}, (error) => {
		res.status(400).send(error)
	})
})

app.post('/forum/post/:id', (req, res) => {
	const id = req.params.id

	if(!ObjectID.isValid(id)){
		return res.status(404).send()
	}

	Post.findById(id).then((post) => {
		if (post){
			const reply = {
				creator: req.body.creator,
				content: req.body.content
			}
			post.replies.push(reply)
			post.save().then((result) => {
				res.send(post.replies[post.replies.length-1])
			}).catch((error) => {
				res.status(400).send(error)
			})
		}
	}).catch((error2) => {
		res.status(400).send(error2)
	})

})




//------------------------- Admin --------------------------------

app.get('/admin/allPost', (req, res) => {
	Post.find().then((post) => {
		res.send(post)
	}).catch( (error) => {
		res.status(400).send(error)
	})
})

app.get('/admin/allUser', (req, res) => {
	User.find().then((user) => {
		res.send(user)
	}).catch( (error) => {
		res.status(400).send(error)
	})
})

app.get('/admin/allGroup', (req, res) => {
	StudyGroup.find().then((studyGroup) => {
		res.send(studyGroup)
	}).catch( (error) => {
		res.status(400).send(error)
	})
})

// delete user
app.delete('/admin/deleteUser/:id', (req, res) => {
	const id = req.params.id

	// Validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	User.findByIdAndRemove(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send({ user })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})

})

// delete study group
app.delete('/admin/deleteStudyGroup/:id', (req, res) => {
	const id = req.params.id

	// Validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	StudyGroup.findByIdAndRemove(id).then((studyGroup) => {
		if (!studyGroup) {
			res.status(404).send()
		} else {
			res.send({ studyGroup })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})

// delete post
app.delete('/admin/deletePost/:id', (req, res) => {
	const id = req.params.id

	// Validate the id
	if (!ObjectID.isValid(id)) {
		return res.status(404).send()
	}

	// Otheriwse, findByIdAndRemove
	Post.findByIdAndRemove(id).then((post) => {
		if (!post) {
			res.status(404).send()
		} else {
			res.send({ post })
		}
	}).catch((error) => {
		res.status(400).send(error)
	})
})


// ------------ avatar ------------------------
app.get("/avatar/webpage", (req, res) => {
	res.sendFile(__dirname + "/public/views/avatar.html")
})


app.listen(port, () => {
	log(`Listening on port ${port}...`)
});