'use strict';

const {Wit, log, interactive} = require('node-wit');

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'mapquest',
  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'FxQQC265SutbcWuIUGx671Ppi8rofRHg', // for Mapquest, OpenCage, Google Premier
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

var WeatherMan = require('weather-man');
var async = require('async');

var wm = new WeatherMan('darksky','a3a55b2a0038f261f5f1d6f2f1bf0bb5');


const accessToken = 'VHN6PP5OLI4VJ4QTBWLUZ6EV3QLLUK5P';

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
  Array.isArray(entities[entity]) &&
  entities[entity].length > 0 &&
  entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getForecast({context, entities}) {

    return new Promise(function(resolve, reject) {
      var location = firstEntityValue(entities, 'location')
      if (location) {
        async.waterfall([
          processGeocode(location),
          getWeather,
        ],
        function (err, result) {

          if(err){
            // handle error
            res.send('Error in Connection')
          }
          console.log('...');
          message = result;
          result = 'The temperature is ' + result.getTemperature(WeatherMan.CELCIUS) + ' C ';
          // Return the result as a JSON object
          // //
          // console.log(result);
          // res.json(result)
        });
        context.forecast = 'sunny in ' + location; // we should call a weather API here
        delete context.missingLocation;
      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
    });
  },
};

const client = new Wit({accessToken, actions});
interactive(client);

function processGeocode (location) {
    return function (callback) {
      geocoder.geocode(location, function(err, res) {
         callback(null,res)
      });
   }
}

function getWeather(location,callback) {
    return function (callback) {
       var somethingelse = function () {
         wm.getCurrent(location[0].latitude, location[0].longitude).then(function(result) {
           console.log(result)
           return callback(null,result)
         })
         .catch(function(err) {
           console.log(err);
         });

       };
       callback (err, result);
    }
}
