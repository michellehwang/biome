var client = new BinaryClient('ws://localhost:9000');
var stream;
var transactionID = 0;
var pending = {};

client.on('open', function() {
    stream = client.createStream();
    stream.on('data', function(data) {
        console.log("Received data:", data);
        var funct = pending[data.ID];
        funct(data); 
    });
});

function register(file, userAccounts) {
    stream.write({photo: file, action: 'register', accounts: userAccounts});
}

function authenticate(file, callback) {
    stream.write({ID: transactionID, photo: file, action: 'authenticate'});
    pending[transactionID] = callback; 
    transactionID ++;
}