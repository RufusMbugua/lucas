'use strict';
// Core Bot Framework
// Load Modules
const botkit = require('botkit');
const Botmaster = require('botmaster');
const express = require('express');
const WebUIBot = require('./bots/web');
const SlackBOT = require('slackbots');
const TelegramBot = require('node-telegram-bot-api');
const BootBot = require('bootbot');

// // Set Twitter Variables
// const twitterSettings = {
//   domain:'/',
//   credentials: {
//     consumerKey: process.env.TWITTER_consumerKey,
//     consumerSecret: process.env.TWITTER_consumerSecret,
//     accessToken: process.env.TWITTER_accessToken,
//     accessTokenSecret: process.env.TWITTER_accessTokenSecret,
//   }
// }
// 
// 

// // Set Web Variables
// const webSettings = {
//   domain:'/',
//   webhookEndpoint:'/',
//   baseMessageURL:'http://localhost:3000/bot'
// }

// // Set Slack Variables
// const slackSettings = {
//     token: process.env.SLACK_BOT_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
//     name: process.env.SLACK_BOT_NAME
// }

// //  Set Telegram Variables
// const telegramSettings = {
//   polling: true
// }

const facebookSettings = {
  accessToken: process.env.FB_ACCESS_TOKEN,
  verifyToken: process.env.FB_VERIFY_TOKEN,
  appSecret: process.env.FB_APP_SECRET
};

// Create Core Bot Object
const bot = {
    Messenger: new BootBot(facebookSettings)
  // WebUIBot: new WebUIBot(webSettings),
  // TwitterBot: new Botmaster.botTypes.TwitterBot(twitterSettings),
  // SlackBot: new SlackBOT(slackSettings),
  // TelegramBot: new TelegramBot(process.env.TELEGRAM_BOT_TOKEN,telegramSettings)
}

module.exports = bot;
