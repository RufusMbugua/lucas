var axios = require('axios');
var CurrentResult = require('../results/currentResult');
var MalformedResponse = require('../utils/exceptions').MalformedResponse;
var constants = require('../utils/constants');
var results = require('../utils/results');

function condition(code) {
    var returnCode = constants.CLEAR;

    var map = {
        'clear-day': constants.CLEAR,
        'clear-night': constants.CLEAR,
        'rain': constants.RAIN,
        'snow': constants.SNOW,
        'sleet': constants.SNOW,
        'wind': constants.WIND,
        'fog': constants.FOG,
        'cloudy': constants.CLOUDY,
        'partly-cloudy-day': constants.CLOUDY,
        'partly-cloudy-night': constants.CLOUDY,
        'hail': constants.HAIL,
        'thunderstorm': constants.THUNDERSTORM,
        'tornado': constants.TORNADO,
    };

    if (map[code]) {
        returnCode = map[code];
    }

    return returnCode;
}

function flatResults(res) {

    var map = {};

    map[constants.LAT] = 'latitude';
    map[constants.LON] = 'longitude';
    map[constants.TEMP] = 'currently.temperature';
    map[constants.MAX] = '_temp_max';
    map[constants.MIN] = '_temp_min';
    map[constants.CODE] = 'currently.icon';
    map[constants.SUMMARY] = 'currently.summary';
    map[constants.HUMIDITY] = 'currently.humidity';
    map[constants.PRESSURE] = 'currently.pressure';
    map[constants.VISIBILITY] = 'currently.visibility';
    map[constants.SUNRISE] = '_sunrise';
    map[constants.SUNSET] = '_sunset';
    map[constants.WIND_SPEED] = 'currently.windSpeed';
    map[constants.WIND_DIR] = 'currently.windBearing';
    map[constants.FEELS_LIKE] = 'currently.apparentTemperature';

    return results.mapResults(res, map);
}

function convertTime(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.getHours() * 60 + date.getMinutes();
}

function getCurrent(lat, lng, apiKey) {
    var url = 'https://api.darksky.net/forecast/' + apiKey + '/' + lat + ',' + lng;
    return axios.get(url).then(function(res) {
        var result = new CurrentResult();

        if (res.data.currently && res.data.daily) {
            result.setTemperature(res.data.currently.temperature, constants.FAHRENHEIT);
            result.setCondition(condition(res.data.currently.icon));
            result.setHumidity(res.data.currently.humidity * 100);
            result.setWindSpeed(res.data.currently.windSpeed, constants.MILES);

            var current = null;
            for (var index in res.data.daily.data) {
                if (!current || res.data.daily.data[index].time < current.time) {
                    current = res.data.daily.data[index];
                }
            }

            if (current) {
                result.setSunrise(convertTime(current.sunriseTime));
                result.setSunset(convertTime(current.sunsetTime));
            }

            res.data._sunrise = res.data._sunrise || current.sunriseTime;
            res.data._sunset = res.data._sunset || current.sunsetTime;
            res.data._temp_max = res.data._temp_max || current.temperatureMax;
            res.data._temp_min = res.data._temp_min || current.temperatureMin;

            result.setRawResults(flatResults(res.data));
        }
        else {
            throw new MalformedResponse(constants.OPENWEATHERMAP);
        }

        return result;
    });
}

module.exports = {
    getCurrent: getCurrent,
};
