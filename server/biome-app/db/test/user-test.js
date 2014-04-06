var mongoose = require('mongoose');
var DB = require('../db.js');
var User = require('./../user.js').User;
var Account = require('./../account.js').Account;

var michelle = new User({ name : "michelle", accounts: {} });
var iris = new User({ username : "iriswang", accounts: {}});

michelle.save();
iris.save();

michelle.addAccount("dropbox", "michellehwang", "dropbox");
michelle.addAccount("facebook", "michellehwang", "facbeook");
michelle.addAccount("google", "michellehwang", "google");
iris.addAccount("iris", "fbuname", "pw")

// User.find({ name: "michelle"}, function(err, result) {
// 	console.log(err);
// 	console.log("h i" + result)
// })
// michelle.deleteAccount(michelle.accounts["dropbox"]._id)
// User.find({ username: "michellehwang"})

michelle.deleteAccount("google")
//teardown
User.find(function(err, results) {
	console.log(results);
	for (res in results) {
		results[res].remove();
	}
})

