var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
    username: String,
    password: String,
})

var Account = mongoose.model('Account', accountSchema, 'Account')
exports.Account = Account
