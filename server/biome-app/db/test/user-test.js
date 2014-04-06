var mongoose = require('mongoose');
var DB = require('../db.js');
var User = require('./../user.js').User;
var Account = require('./../account.js').Account;

var michelle = new User({ uid:0, imgPaths: ["hihihi", "hel"], name : "michelle", accounts: {} });
var iris = new User({ uid: 1,imgPaths:["fake"], username : "iriswang", accounts: {}});

michelle.save();
iris.save();

michelle.addAccount("dropbox", "michellehwang", "dropbox");
michelle.addAccount("facebook", "michellehwang", "facbeook");
michelle.addAccount("google", "michellehwang", "google");
iris.addAccount("iris", "fbuname", "pw");

michelle.deleteAccount("google");


console.log("BEGIN OTHER STUF")
// var usr = michelle.findIdByPath
//teardown
function findIdByPath(imgPath, callback) {
	var cb = callback;
    var usr = User.find({imgPaths:imgPath}, function(err, users) {
        // for (user in users) {
        //     paths = users[user].imgPaths;
        //     for (var i = 0; i < paths.length; i++) {
        //         if (paths[i] == imgPath) {
        //             return users[user].uid
        //             // return users[user]._id;
        //         }
        //     }
        // }
        if (users.length > 0) {
        	callback(users[0]); return;
        }
        callback(null);
    });
    if (usr == null) {
    	console.log("could not find usr");
    } else {
    	return usr;
    }
};

findIdByPath(michelle.imgPaths[0], function(results) {
	console.log(results);
});
findIdByPath(michelle.imgPaths[0], function(results) { 
	console.log(results);
});

User.find(function(err, results) {
	// console.log("res"+results);
	for (res in results) {
		results[res].remove();
	}
})

