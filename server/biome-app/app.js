
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var fs = require('fs');

var ml = require('./ml/ml');

var app = express();
var DB = require('./db/create').DB;
var User = require('./db/user.js').User;
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);


// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

var imgCount = 0;
var userId = 0;

// Wait for new user connections
bs.on('connection', function(client){
    console.log("Connection");
    // Incoming stream from browsers
    client.on('stream', function(stream){
        stream.on('close', function() {
          console.log("Stream closing");
        })
        stream.on('error', function(err) {
          console.log(err)
        })
        stream.on('data', function(data){
            var userdata = data;
            console.log(data);
            if (userdata.action == 'register') {
                var result = serverReg(data.photo, data.accounts, data.ID);
                stream.write(result);
                console.log(data);
            } else if (userdata.action == 'authenticate') {
                serverAuth(data.photo, data.ID, function(result) {
                  if (result == null) {
                    stream.write({ID:data.ID});
                    return;
                  }
                  var obj = result.toJSON();
                  var obj2 = {
                      "accounts" : {
                        "facebook" : {
                          "username" : obj.accounts.facebook.username,
                          "password" : obj.accounts.facebook.password,
                        },
                        "dropbox" : {
                          "username" : obj.accounts.dropbox.username,
                          "password" : obj.accounts.dropbox.password,
                        },
                        "gmail" : {
                          "username" : obj.accounts.gmail.username,
                          "password" : obj.accounts.gmail.password,
                        }
                      },
                      "_id" : obj._id.toHexString(),
                      ID : data.ID
                    };
                    stream.write(obj2);
                });
            } else if (userdata.action == "addPhoto") {
                console.log("please...");
                var result = serverAddPhoto(data.photo, data.ID);
                stream.write(result);
            } else {
                console.log("this is bad! it's not matching any of the actions");
            }
        });
    });
});

function serverAuth(file, ID, callback) {
    var fs = require('fs');
    var imgpath = "images/temp.png"
    fs.writeFile(imgpath, file, function(err) {
        if(err) {
            console.log(err);
        } else {
            ml.classifyImage(imgpath, function(result) {
              if (!result) {
                callback(null);
              }
              console.log("Image: ", result);
              findIdByPath(result, function(user) {
                callback(user);
              });
            });
        }
    });

    return {'ID': ID, 'userAccounts' : {'facebook' : {'username' : 'iris', 'password' : 'hola'}, 'gmail' : {'username' : 'allen', 'password' : 'folla'}, 'dropbox' : {'username' : 'michelle', 'password' : 'mollyy' }}}
}

function serverReg(file, accounts, ID) {
    var fs = require('fs');
    var imgPath = "images/img_" + imgCount + ".png";
    imgCount++;
    fs.writeFile(imgPath, file, function(err) {
        if(err) {
            console.log(err);
        } else {
        	newUser = User({ uid: userId, accounts: {}, imgPaths: [imgPath] })
            userId += 1
        	for (acct in accounts) {
        		var vals = accounts[acct];
        		newUser.addAccount(acct, vals["username"], vals["password"])
        	}
        	newUser.save()
            console.log("The file was saved!");
        }
    });
    return {'ID': ID};
}

function serverAddPhoto(file, ID) {
    console.log("I'm adding a photo!");
    console.log("file is: ");
    console.log(file);

    var imgPath = "images/img_" + imgCount + ".png";
    imgCount++;

    var fs = require('fs');
    fs.writeFile(imgPath, file, function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("The file was saved!");
        }
    });
    //Need to remove file if it's an unsuccessful add (so check add code)
    //Else: add to the database
    return {'ID': ID, 'userAccounts' : {'facebook' : {'username' : 'iris', 'password' : 'hola'}, 'gmail' : {'username' : 'allen', 'password' : 'folla'}, 'dropbox' : {'username' : 'michelle', 'password' : 'mollyy' }}}
}

function findIdByPath(imgPath, callback) {
  var path = "images/"+imgPath;
  console.log("Looking for", path);
    User.find({}, function(err, users) {
      if (err) {
        callback(null); return;
      }
      if (users == null) {
        callback(null); return;
      }
      for (user in users) {
        var i = 0;
        for (i = 0; i < users[user].imgPath.length; i++) {
          if (users[user].imgPath[i] == path) {
            callback(users[user]); return;
          }
        }

      }
      callback(null);
    });
};

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');


