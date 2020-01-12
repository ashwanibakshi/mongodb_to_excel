var mongoose = require('mongoose');

var dataSchema = new mongoose.Schema({
    firstname:{type:String},
    lastname:{type:String},
    phno:{type:String},
    city:{type:String},
    state:{type:String},
    country:{type:String}
});

module.exports = mongoose.model('data',dataSchema);