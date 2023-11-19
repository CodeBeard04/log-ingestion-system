const express = require('express');
const moment = require('moment');
const { isEmpty } = require('lodash');

const router = express.Router();

const LogModel = require('../models/LogModel.js');

/* --------- GET Logs ----------- */

router.get('/', async (req, res) => {
    try {
        const logs = await LogModel.find();
        res.status(200).json(logs);
    } catch (err) {
        res.send(`Error occured - ${err}`)
    }
})

// Endpoint for full-text search

router.get('/search', async (req, res) => {
    const { query, startDateTime, endDateTime, selectedOption } = req.query;

    try {
        console.log(req.query)
        let obj = {};

        const startDate = new Date(startDateTime);
        const endDate = new Date(endDateTime);

        if (!isEmpty(startDateTime) && !isEmpty(endDateTime)) {
            obj.timestamp = {
                $gte: startDate,
                $lte: endDate,
            };
        }

        if (!isEmpty(query) && !isEmpty(selectedOption)) {
            obj = {
                [selectedOption]: query
            }
        }

        const records = await LogModel.find(obj);

        res.json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


/* --------- Add Log ----------- */

router.post('/addLog', async (req, res) => {
    const jsonData = req.body;

    try {
        const result = await LogModel.create(jsonData);
        res.json(result);
    } catch (err) {
        res.send(`Error occured - ${err}`)
    }
});

module.exports = router;