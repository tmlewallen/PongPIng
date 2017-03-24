let mongoose = require('mongoose');
let URL = process.env.MONGO_URL || 'localhost';
let USER = process.env.MONGO_USR || '';
let PASSWORD = process.env.MONGO_PWD || '';

mongoose.connect(`mongodb://${USER}:${PASSWORD}@${URL}`); //TODO doens't work for localhost
console.log(`Connecting to ${URL}...`);

let db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Connected!'));

module.exports = db;