var mongoose = require('mongoose');
var Account = require('./account.js').Account;

var userSchema = mongoose.Schema({
	uid: Number,
	name: String,
    imgPaths: Array,
    accounts: Object,
}, {
  collection: "user"
})

userSchema.methods.deleteAccount = function (id) {
	delete this.accounts[id]
}

userSchema.methods.addAccount = function (acct, uname, pwd) {
  console.log("Adding accts")
	newAcct = new Account({ username : uname, password : pwd });
	console.log(this)
	this.accounts[acct] = newAcct
}

userSchema.methods.addImgPath = function (imgPath) {
	this.img_path.append(imgPath);
}


// userSchema.methods.addImgPath = function (id, img_path)


// userSchema.statics.getUserById = function(id) {
// 	for user in
// }
var User = mongoose.model('User', userSchema)
exports.User = User