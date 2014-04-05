var client = new BinaryClient('ws://localhost:9000');
var stream = client.createStream();
var transactionID = 0;
var pending = {};

stream.on('data', function(data) {
    var funct = pending[data.transactionID];
    funct(data); 
});

var transactionId = 0;

function register(file, userAccounts) {
    stream.write({photo: file, action: 'register', accounts: userAccounts});
}

function authenticate(file) {
    serverAuth(file, function(data) {
        return data;
    });
}
function serverAuth(file, callback) {
    stream.write({ID: transactionID, photo: file, action: 'authenticate'});
    pending[transactionID] = callback; 
    transactionID ++;
}
