// routes/index.js
var express = require('express');
var router = express.Router();
let dbConnector = require('../utils/dbConnector');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Register a user
router.get('/register', async (req, res, next) => {
  try {
    await dbConnector.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database: ", error);
  }
});

module.exports = router;
