const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')


const CourseSchema = new mongoose.Schema({
	courseCode: String,
	courseName: String,
	section: String,
	lecturer: String
});


const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstName: String,
	lastName: String,
	age: String,
	gender: String,
	university: String,
	program: String,
	yearOfStudy: String,
	phoneNumber: String,
	email: String,
	courseList: [CourseSchema],
	studyGroupList: [Object],
	honour: String,
	hobby: String,
	profileImage: String,
	friendList: [String]
})











// Our own student finding function
UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this

	return User.findOne({username: username}).then((user) => {
		if (!user) {
			return Promise.reject()
		}

		// return Promise.resolve(user)
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (error, result) => {
				if (result) {
					resolve(user);
				} else {
					reject();
				}
			})
		})
	})
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
	const user = this

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(user.password, salt, (error, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next();
	}

})


const User = mongoose.model('User', UserSchema)

module.exports = { User }
