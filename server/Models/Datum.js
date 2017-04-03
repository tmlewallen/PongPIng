let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let datumSchema = new Schema({
    tableId : Number,
    rawVal : Number,
    delta : Number,
    timestamp : Number
}, {collection : 'pong'});
module.exports = mongoose.model('Datum', datumSchema);