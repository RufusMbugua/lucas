var express = require('express');
var router = express.Router();
var app = express();

// Main Route
router.get('/', function(req, res) {
  res.render('index')
});

// Login
router.post('/login', function(req, res) {
  models.User.findAll({
    where: {
      "username": req.body.username,
      "password": req.body.password,
    }
  }).then(function(user) {
    res.send(user)
  })
});

module.exports = router;
