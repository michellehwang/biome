var mongoose = require('mongoose');
var Account = require('./account.js').Account;

var userSchema = mongoose.Schema({
	name: String,
    img_path: Array,
    accounts: Object,
})

userSchema.methods.deleteAccount = function (id) {
    User.find({_id: id}, function(err, results) {
    	if (err != null) {
    		for (res in results) {
    			results[res].remove()
    		}
    	}
    })
    // if (this.accounts.acct) {
    // 	console.log('hi')
    //     delete this.accounts.acct
    //     console.log("accounts\n" + this.accounts )
    // } else {
    //     console.log("Error: account does not exist")
    // }
}

userSchema.methods.addAccount = function (acct, uname, pwd) {
	newAcct = new Account({ username : uname, password : pwd, "what": "waht" });
	this.accounts[acct] = newAcct
}

// userSchema.methods.addImgPath = function (id, img_path)
	

// userSchema.statics.getUserById = function(id) {
// 	for user in 
// }
var User = mongoose.model('User', userSchema)
exports.User = User

