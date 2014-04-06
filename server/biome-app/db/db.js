var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/biome', function(err) {
        console.log(err);
});
exports.DB = db;