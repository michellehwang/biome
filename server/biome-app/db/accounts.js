var mongoose = require('mongoose');

var accountSchema = mongoose.Schema({
        name: String,
        password: String,

})

var Accounts = mongoose.model('Account', accountSchema)
exports.Account = Account
