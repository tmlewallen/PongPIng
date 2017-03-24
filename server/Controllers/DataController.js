let express = require('express');
let datumModel = require('../Models/Datum');
let moment = require('moment');
let app = express.Router();

app.route('/list/:startDate')
    .get((req, res) => {
        let refDate = req.params.startDate;
        let ts = moment(refDate).unix();
        datumModel.find({"timestamp" : {"$gt" : ts}}, (err, result) => {
            if (err) res.status(500).send(err);
            else res.status(200).json(result);
        });
    });

module.exports = app;
