var fs = require('fs');
var http = require('http');

// Serve client side statically
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);

// Start Binary.js server
var BinaryServer = require('binaryjs').BinaryServer;
var bs = BinaryServer({server: server});

// Wait for new user connections
bs.on('connection', function(client){
    // Incoming stream from browsers
    client.on('stream', function(stream){
        stream.on('data', function(data){
            var userdata = data;
            if (userdata.action == 'register') {
                register(data.photo, data.accounts);
                console.log(data);
            } else if (userdata.action == 'authenticate') {
                var result = authenticate(data.photo, data.ID);
                console.log(data);
                stream.write(result);
            } else {
                console.log("this is bad! it's not matching any of the actions");
                console.log(data);
            }
        });
    });
});

function authenticate(file, ID) {
    console.log("I'm authenticating!");
    console.log("file is: ");
    console.log(file);
    return {"ID": ID, "username": "iris", "password": "hola"};
}

function register(file, accounts) {
    console.log("I'm registering!");
    console.log("file is: ");
    console.log(file);
    console.log("accounts are: ");
    console.log(accounts);
}

server.listen(9000);
console.log('HTTP and BinaryJS server started on port 9000');


