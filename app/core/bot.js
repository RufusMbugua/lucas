'use strict'
// Core Bot Framework
// Load Modules
// const botkit = require('botkit');
// const Botmaster = require('botmaster');

// const SlackBOT = require('slackbots');
// const TelegramBot = require('node-telegram-bot-api');

const Telegraf = require('telegraf')
const TelegrafWit = require('telegraf-wit')

// const facebookSettings = {
//   accessToken: process.env.FB_ACCESS_TOKEN,
//   verifyToken: process.env.FB_VERIFY_TOKEN,
//   appSecret: process.env.FB_APP_SECRET
// }

// Create Core Bot Object
const bot = {
  telegraf: new Telegraf(process.env.TELEGRAM_BOT_TOKEN),
  wit: new TelegrafWit(process.env.WIT_TOKEN)
}

// bot.telegraf.use(Telegraf.memorySession())


module.exports = bot
