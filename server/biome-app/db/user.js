var mongoose = require('mongoose');
var Account = require('./account.js').Account;

var userSchema = mongoose.Schema({
	name: String,
    imgPath: Array,
    accounts: Object,
})

userSchema.methods.deleteAccount = function (id) {
	delete this.accounts[id]
}

userSchema.methods.addAccount = function (acct, uname, pwd) {
	newAcct = new Account({ username : uname, password : pwd });
	console.log(this)
	this.accounts[acct] = newAcct
}

userSchema.methods.addImgPath = function (img_path) {
	this.img_path.append(img_path);
}

// userSchema.methods.addImgPath = function (id, img_path)
	

// userSchema.statics.getUserById = function(id) {
// 	for user in 
// }
var User = mongoose.model('User', userSchema)
exports.User = User

