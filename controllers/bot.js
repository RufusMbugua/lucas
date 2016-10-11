var express = require('express');
var router = express.Router();
var TelegramBot = require('node-telegram-bot-api');

var token = '241964818:AAFNMMqV1_nRuvA0D_nqz3zB15o77pMZsKI';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});

router.get('/', function(req, res) {
  var query = req.query;
  var message = query.message;

  // res.send('Hello');
  // // Matches /echo [whatever]
  bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
  });

  // Any kind of message
  bot.on('message', function (msg) {
    var chatId = msg.chat.id;
    // photo can be: a file path, a stream or a Telegram file_id
    var message = "Wsup. I'm Lucas";
    bot.sendMessage(chatId, message);
  });
})

module.exports = router;
