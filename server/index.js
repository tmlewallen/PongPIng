let express = require('express');
let db = require('./db');
// let mockData = require('./MOCK').splice(0,50);
// let _ = require('lodash');
let PORT = process.env.PORT || 4000;
let app = express();

app.use('/data', require('./Controllers/DataController'));

app.use(express.static(__dirname + "/../app/"));

app.listen(PORT, () => {
    console.log("Listening on " + PORT + "...");
});