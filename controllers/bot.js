var express = require('express');
var router = express.Router();
var TelegramBot = require('node-telegram-bot-api');

var token = '241964818:AAFNMMqV1_nRuvA0D_nqz3zB15o77pMZsKI';
// Setup polling way
var bot = new TelegramBot(token, {
  polling: true,
  webHook:{
    port:8443,
    key: './rufusmbugua.key',
    cert: './rufusmbugua.pem'
  }
});
bot.setWebHook('lucas.rufusmbugua.com/bot'+token, './rufusmbugua.pem');

bot.onText(/\/echo (.+)/, function (msg, match) {
  var fromId = msg.from.id;
  var resp = match[1];
  bot.sendMessage(fromId, resp);
});

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  // photo can be: a file path, a stream or a Telegram file_id
  switch(msg.text){
    case 'Hi':
      message = "Wsup. I'm Lucas";
    break;

    case 'Bye':
      message = "May the force be with you.";
    break;

    default:
      message = 'Nice hearing from you, padawan.';
    break;

  }
  bot.sendMessage(chatId, message);
});

router.get('/', function(req, res) {
  var query = req.query;
  var message = query.message;

  res.send(message);
  // // Matches /echo [whatever]

})

module.exports = router;
