var express = require('express');
var SlackBot = require('slackbots');
var router = express.Router();

// create a bot
var bot = new SlackBot({
    token: process.env.SLACK_BOT_TOKEN_V, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: process.env.SLACK_BOT_NAME_V
});

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage

    // define channel, where bot exist. You can adjust it there https://my.slack.com/services
    // bot.postMessageToChannel('general', 'Hi @collinsichigo');


});

bot.on('message', function(message) {
    // all ingoing events https://api.slack.com/rtm
    if(message.text){
      if(message.text.toLowerCase().indexOf('vader') > -1){
        bot.postMessageToChannel('general',"Don't wear it out");
      }
      if(message.text.toLowerCase().indexOf('dead') > -1){
        bot.postMessageToChannel('general',"I shall live forever!");
      }
      if(message.text.toLowerCase().indexOf("here") > -1){
        bot.postMessageToChannel('general',"Where?");
      }
      if(message.text.toLowerCase().indexOf("nuts") > -1){
        bot.postMessageToChannel('general',"Yeah I do");
      }
    }
});
  module.exports = router;
