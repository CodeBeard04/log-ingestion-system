const express = require('express');
const moment = require('moment');

const router = express.Router();

const LogModel = require('../models/LogModel.js');

/* --------- GET Logs ----------- */

router.get('/', async(req, res) => {
    try {
        const logs = await LogModel.find();
        res.status(200).json(logs);
    } catch (err) {
        res.send(`Error occured - ${err}`)
    }
})

// Endpoint for full-text search

router.get('/search', async (req, res) => {
    const { query } = req.query;
  
    try {
        console.log(query);
      const results = await LogModel.find({ $text: { $search: query } });
      console.log(results);
      res.json({ success: true, results });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  

/* --------- Add Log ----------- */

router.post('/addLog', async (req, res) => {

    // const newLog = new LogModel({
    //     level : req.body.level,
    //     message : req.body.message,
    //     resourceId : req.body.resourceId,
    //     timestamp: moment().format(),
    //     traceId : req.body.traceId,
    //     spanId : req.body.spanId,
    //     commit : req.body.commit,
    //     metadata: {
    //         parentResourceId: req.body.metadata.parentResourceId
    //     }
    // });

    const jsonData = req.body;

    try {
        const result = await LogModel.create(jsonData);
        res.json(result);
    } catch (err) {
        res.send(`Error occured - ${err}`)
    }
});

module.exports = router;