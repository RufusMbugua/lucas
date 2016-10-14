//Shims for Pebble to allow browserify to work
if (typeof Pebble !== 'undefined') {
    window.location = {}; //Shim for iOS
    document.createElement = null; //Shim to trick the browserify shims (also for iOS)
}

require('es6-promise').polyfill();

var yahoo = require('./providers/yahoo');
var openweathermap = require('./providers/openweathermap');
var yrno = require('./providers/yrno');
var darksky = require('./providers/darksky');
var aqicn = require('./providers/aqicn');
var constants = require('./utils/constants');
var InvalidProvider = require('./utils/exceptions').InvalidProvider;
var CurrentAQIResult = require('./results/currentAQIResult');
var CurrentResult = require('./results/currentResult');

var WeatherMan = function(providerName, apiKey) {
    if (WeatherMan.providerNames.indexOf(providerName) == -1) {
        throw new InvalidProvider(providerName);
    }

    this.providerName = providerName;
    this.apiKey = apiKey;
};

WeatherMan.providerNames = [
    constants.YAHOO,
    constants.OPENWEATHERMAP,
    constants.YRNO,
    constants.FORECASTIO,
    constants.DARKSKY,
    constants.AQICN,
];

WeatherMan.FAHRENHEIT = constants.FAHRENHEIT;
WeatherMan.CELCIUS = constants.CELCIUS;
WeatherMan.KELVIN = constants.KELVIN;

WeatherMan.KILOMETERS = constants.KILOMETERS;
WeatherMan.MILES = constants.MILES;
WeatherMan.METERS = constants.METERS;

WeatherMan.AMPM = constants.AMPM;

WeatherMan.YAHOO = constants.YAHOO;
WeatherMan.OPENWEATHERMAP = constants.OPENWEATHERMAP;
WeatherMan.YRNO = constants.YRNO;
WeatherMan.FORECASTIO = constants.FORECASTIO;
WeatherMan.DARKSKY = constants.DARKSKY;
WeatherMan.AQICN = constants.AQICN;

WeatherMan.CLEAR = constants.CLEAR;
WeatherMan.CLOUDY = constants.CLOUDY;
WeatherMan.FOG = constants.FOG;
WeatherMan.LIGHT_RAIN = constants.LIGHT_RAIN;
WeatherMan.RAIN = constants.RAIN;
WeatherMan.THUNDERSTORM = constants.THUNDERSTORM;
WeatherMan.SNOW = constants.SNOW;
WeatherMan.HAIL = constants.HAIL;
WeatherMan.WIND = constants.WIND;
WeatherMan.EXTREME_WIND = constants.EXTREME_WIND;
WeatherMan.TORNADO = constants.TORNADO;
WeatherMan.HURRICANE = constants.HURRICANE;
WeatherMan.EXTREME_COLD = constants.EXTREME_COLD;
WeatherMan.EXTREME_HEAT = constants.EXTREME_HEAT;
WeatherMan.SNOW_THUNDERSTORM = constants.SNOW_THUNDERSTORM;

WeatherMan.CurrentResult = CurrentResult;
WeatherMan.CurrentAQIResult = CurrentAQIResult;

WeatherMan.prototype.getProvider = function(name) {
    var provider = null;
    if (name == constants.YAHOO) {
        provider = yahoo;
    }
    else if (name == constants.OPENWEATHERMAP) {
        provider = openweathermap;
    }
    else if (name == constants.YRNO) {
        provider = yrno;
    }
    else if (name == constants.FORECASTIO || name == constants.DARKSKY) {
        provider = darksky;
    }
    else if (name == constants.AQICN) {
        provider = aqicn;
    }
    else {
        throw new InvalidProvider(name);
    }

    return provider;
};

WeatherMan.prototype.getCurrent = function(lat, lng, getSunrise) {
    return this.getProvider(this.providerName).getCurrent(lat, lng, this.apiKey, getSunrise);
};

module.exports = WeatherMan;
