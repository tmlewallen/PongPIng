let express = require('express');
let mockData = require('./MOCK').splice(0,50);
let _ = require('lodash');
let PORT = process.env.PORT || 4000;
let app = express();

app.get('/data', (req, res) => {
    _.map(mockData, (d) => {
        d.value = Math.random();
        d.timestamp = new Date();
    });
    res.json(mockData);
});

app.use(express.static(__dirname + "/../app/"));

app.listen(PORT, () => {
    console.log("Listening on " + PORT + "...");
});