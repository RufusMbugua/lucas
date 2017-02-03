var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var assets = require('connect-assets');

// List Bots
var lucas_telegram = require('./controllers/lucas_telegram');
var lucas_wit = require('./controllers/lucas_wit');
var vader_slack = require('./controllers/vader_slack');

var app = express();
// view engine setup

// =======================
// configuration =========
// =======================

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/lucas_telegram', lucas_telegram);
app.use('/lucas_wit', lucas_wit);
app.use('/vader_slack', vader_slack);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


// botmaster
const botmasterSettings = {
  // by default botmaster will start an express server that listens on port 3000
  // you can pass in a port argument here to change this default setting:
  port: 3001,
}

const botmaster = new Botmaster(botmasterSettings);

// you would typically hold this information in a "config" file.
// or use environment variables
const messengerSettings = {
  credentials: {
    verifyToken: 'YOUR verifyToken',
    pageToken: 'YOUR pageToken',
    fbAppSecret: 'YOUR fbAppSecret',
  },
  webhookEndpoint: '/webhook1234', // botmaster will mount this webhook on https://Your_Domain_Name/messenger/webhook1234
};

const twitterSettings = {
  credentials: {
    consumerKey: 'YOUR consumerKey',
    consumerSecret: 'YOUR consumerSecret',
    accessToken: 'YOUR accessToken',
    accessTokenSecret: 'YOUR accessTokenSecret',
  }
}

const telegramSettings = {
  credentials: {
    authToken: 'YOUR authToken',
  },
  webhookEndpoint: '/webhook1234/',
};

const slackSettings = {
  credentials: {
    clientId: 'YOUR app client ID',
    clientSecret: 'YOUR app client secret',
    verificationToken: 'YOUR app verification Token',
    landingPageURL: 'YOUR landing page URL' // users will be redirected there after adding your bot app to slack. If not set, they will be redirected to their standard slack chats.
  },
  webhookEndpoint: '/webhook',
  storeTeamInfoInFile: true,
};

const socketioSettings = {
  id: 'SOME_ID_OF_YOUR_CHOOSING',
};

// instantiate new objects of the various bot classes bundled in with
// the botmaster package. Other bot class packages can be installed or
// built.
const messengerBot = new Botmaster.botTypes.MessengerBot(messengerSettings);
const slackBot = new Botmaster.botTypes.SlackBot(slackSettings);
const socketioBot = new Botmaster.botTypes.SocketioBot(socketioSettings));
const twitterBot = new Botmaster.botTypes.TwitterBot(twitterSettings);
const telegramBot = new Botmaster.botTypes.TelegramBot(telegramSettings);

botmaster.addBot(messengerBot);
botmaster.addBot(slackBot);
botmaster.addBot(socketioBot);
botmaster.addBot(twitterBot);
botmaster.addBot(telegramBot);


module.exports = app;
