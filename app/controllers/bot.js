'use strict'
// Load Required Modules
// Load Core Bot Framework
const bot = require('../core/bot')
const mapquest = require('mapquest')
const DarkSky = require('dark-sky')
const darksky = new DarkSky(process.env.DARKSKY_TOKEN) // Your API KEY can be hardcoded, but I recommend setting it as an env variable
var _ = require('lodash')
const moment = require('moment')

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] && Array.isArray(entities[entity]) && entities[entity].length > 0 && entities[entity][0].value
  if (!val) {
    return null
  }
  return typeof val === 'object' ? val.value : val
}

bot.telegraf.on('message', (ctx) => {
  return bot.wit.meaning(ctx.message.text)
    .then((result) => {
      // reply to user with wit result
      const place = firstEntityValue(result.entities, 'location')
      if (place) {
        mapquest.geocode({
          address: place
        }, function (err, location) {
          if (err) {
            console.log(err)
          } else {
            darksky.coordinates(location.latLng).units('ca').language('en').exclude('minutely,daily,hourly').get().then(function (body) {
              return ctx.replyWithHTML(cleanArray(body.currently))
            }).catch(console.log)
          }
        })
      } else {}
    })
})

const cleanArray = (results) => {
 var message = "<b>Your comprehensive weather report</b> \n\n" 
  _.forEach(results, function (value, key) {
  	if(key=='time'){
 message += '<b>' + emojify(_.startCase(key)) + '</b> : ' + moment.unix(value).format("HH:mm") + "\n"
  	}
  	else{
  	 message += '<b>' + emojify(_.startCase(key)) + '</b> : ' + value + "\n"
  	}
   
  })
  return message;
}

const emojify = (text) => {
  var emoji = null

  switch (text) {
  case 'Temperature':
    emoji = '🌡️'
    break

   case 'Time':
   emoji = '🕰️'

  default:
    emoji = ''
    break
  }

  return emoji + ' ' + text
}

bot.telegraf.startPolling()