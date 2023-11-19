const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// const LogModel = require('../models/LogModel.js');
const router = require('./routes/logs.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Connected to MongoDB Atlas');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB Atlas:', err.message);
    })

// mongoose.connect(uri)
// .then(() => {
//     console.log("Connected to db");
// }).catch((err) => {
//     console.log("Error while connecting to mongodb: ", err);
// })

app.get('/', (req, res) => res.status(200).json('Status - OK'))

app.use('/logs', router); 

app.listen(PORT, () => {
    console.log("Server is listening on", PORT);
});

module.exports = app;