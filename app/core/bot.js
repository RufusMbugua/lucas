// Core Bot Framework
// Load Modules
var botkit = require('botkit');
var Botmaster = require('botmaster');
var express = require('express');
var WebUIBot = require('./bots/web');
var SlackBOT = require('slackbots');
var TelegramBot = require('node-telegram-bot-api');

// Set Twitter Variables
var twitterSettings = {
  domain:'/',
  credentials: {
    consumerKey: process.env.TWITTER_consumerKey,
    consumerSecret: process.env.TWITTER_consumerSecret,
    accessToken: process.env.TWITTER_accessToken,
    accessTokenSecret: process.env.TWITTER_accessTokenSecret,
  }
}

// Set Web Variables
var webSettings = {
  domain:'/',
  webhookEndpoint:'/',
  baseMessageURL:'http://localhost:3000/bot'
}

// Set Slack Variables
var slackSettings = {
    token: process.env.SLACK_BOT_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: process.env.SLACK_BOT_NAME
}

//  Set Telegram Variables
var telegramSettings = {
  polling: true
}

// Create Core Bot Object
var bot = {
  WebUIBot: new WebUIBot(webSettings),
  TwitterBot: new Botmaster.botTypes.TwitterBot(twitterSettings),
  SlackBot: new SlackBOT(slackSettings),
  TelegramBot: new TelegramBot(process.env.TELEGRAM_BOT_TOKEN,telegramSettings)
}

module.exports = bot;
