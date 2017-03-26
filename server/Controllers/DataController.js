let express = require('express');
let datumModel = require('../Models/Datum');
let moment = require('moment');
let app = express.Router();

app.route('/list/:time')
    .get((req, res) => {
        let refDate = req.params.time;
        let ts = moment(refDate).unix();
        console.log(`/list/${refDate}...`);
        datumModel.find({"timestamp" : {"$gt" : ts}}, (err, result) => {
            if (err) res.status(500).send(err);
            else {
                console.log(`\tResponse 200 - returning ${JSON.stringify(result)}`);
                res.status(200).json(result);
            }
        });
    });

module.exports = app;
