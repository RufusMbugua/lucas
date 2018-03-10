// Load Required Modules
var express = require('express');
var router = express.Router();
var app = express();
var request = require('request');
// Load Core Bot Framework
var bot = require('../core/bot');
var processMessage = require('../core/process');

// Main Route
router.get('/', function(req, res) {
  res.render('index')
});

router.post('/', function(req, res){
  console.log(res)
});

app.listen(3001, function() {});


var message=null;


module.exports = router;
