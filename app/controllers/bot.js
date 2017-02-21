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

app.use('/webui', bot.WebUIBot.app);
app.listen(3001, function() {});

webuibot = bot.WebUIBot;

var message=null;

// Telegram
bot.TelegramBot.on('message', function (msg) {

  var chatId = msg.chat.id;
  // photo can be: a file path, a stream or a Telegram file_id
  processMessage(msg,process.env.API_url,'telegram').then(function(response){

    if(response){
        if(response.image_url){
          bot.TelegramBot.sendPhoto(chatId, request(response.image_url), { caption: response.message });
        }
        else{
          if(response.keyboard){
            keyboard = response.keyboard;

            bot.TelegramBot.sendMessage(chatId, response.message,{
              reply_markup: JSON.stringify({keyboard:keyboard}),
              one_time_keyboard : true});
          }
          else{
            bot.TelegramBot.sendMessage(chatId, response.message);
          }
        }
    }
  });
});


// Twitter
bot.TwitterBot.on('update', (update) => {
  processMessage(msg,process.env.API_url,'twitter').then(function(response){
    if(response){
      bot.TwitterBot.reply(update, response.message);
    }
  });
});

bot.SlackBot.on('message', function(message) {
    // all ingoing events https://api.slack.com/rtm
    if(message.text && message.channel && message.user){
      processMessage(message,process.env.API_url,'slack').then(function(response){
        if(response){
          bot.SlackBot.postMessage(message.channel,response.message);
        }
      });

    }
});

module.exports = router;
