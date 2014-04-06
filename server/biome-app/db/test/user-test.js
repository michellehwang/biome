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

michelle.deleteAccount("google")

//teardown
User.find(function(err, results) {
	console.log(results);
	for (res in results) {
		results[res].remove();
	}
})

