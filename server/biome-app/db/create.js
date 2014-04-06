var mongoose = require('mongoose');
mongoose.connect('mongodb://sharad:sharad@oceanic.mongohq.com:10030/app23807688', function() {
  console.log("Connected:", arguments);
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
});

