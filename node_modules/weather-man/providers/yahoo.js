var axios = require('axios');
var CurrentResult = require('../results/currentResult');
var MalformedResponse = require('../utils/exceptions').MalformedResponse;
var constants = require('../utils/constants');
var results = require('../utils/results');

function condition(code) {
    var returnCode = constants.CLEAR;
    if (code >= 31 && code <= 34) { //Clear
        returnCode = constants.CLEAR;
    }
    else if ((code >= 26 && code <= 30) || code == 44) { //Cloudy
        returnCode = constants.CLOUDY;
    }
    else if (code >= 19 && code <= 22) { //Atmosphere (dust, fog, etc)
        returnCode = constants.FOG;
    }
    else if (code >= 8 && code <= 9) { //Drizzle
        returnCode = constants.LIGHT_RAIN;
    }
    else if ((code >= 10 && code <= 12) || code == 40) { //Rain
        returnCode = constants.RAIN;
    }
    else if (code >= 5 && code <= 6) { //Mixed rain
        returnCode = constants.RAIN;
    }
    else if ((code >= 3 && code <= 4) || (code >= 37 && code <= 39) || code == 45 || code == 47) { //Thunderstorm
        returnCode = constants.THUNDERSTORM;
    }
    else if ((code >= 13 && code <= 16) || (code >= 41 && code <= 43) || code == 46) { //Snow
        returnCode = constants.SNOW;
    }
    else if (code == 7) { //Mixed snow
        returnCode = constants.SNOW;
    }
    else if ((code >= 17 && code <= 18) || code == 35) { //Hail
        returnCode = constants.HAIL;
    }
    else if (code >= 23 && code <= 24) { //Wind
        returnCode = constants.WIND;
    }
    else if (code === 0) { //Tornado
        returnCode = constants.TORNADO;
    }
    else if (code >= 1 && code <= 2) { //Hurricane
        returnCode = constants.HURRICANE;
    }
    else if (code == 25) { //Cold
        returnCode = constants.EXTREME_COLD;
    }
    else if (code == 36) { //Hot
        returnCode = constants.EXTREME_HEAT;
    }

    return returnCode;
}

function flatResults(res) {

    var map = {};

    map[constants.LAT] = 'item.lat';
    map[constants.LON] = 'item.long';
    map[constants.TEMP] = 'item.condition.temp';
    map[constants.CODE] = 'item.condition.code';
    map[constants.SUMMARY] = 'item.condition.text';
    map[constants.HUMIDITY] = 'atmosphere.humidity';
    map[constants.PRESSURE] = 'atmosphere.pressure';
    map[constants.VISIBILITY] = 'atmosphere.visibility';
    map[constants.SUNRISE] = 'astronomy.sunrise';
    map[constants.SUNSET] = 'astronomy.sunset';
    map[constants.WIND_SPEED] = 'wind.speed';
    map[constants.WIND_DIR] = 'wind.direction';

    return results.mapResults(res, map);
}

function convertTime(string) {
    string = string.toLowerCase();
    var time = string.replace('am', '').replace('pm', '').replace(' ', '');
    var split = time.split(':');
    var hours = parseInt(split[0]);
    var minutes = parseInt(split[1]);

    if (string.indexOf('pm') >= 0) {
        hours += 12;
    }

    return (hours * 60) + minutes;
}

function getCurrent(lat, lng) {
    var geo = 'select woeid from geo.places where text="(' + lat + ',' + lng + ')" limit 1';
    var select = 'select * from weather.forecast where woeid in (' + geo + ') and u="c"';
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent(select);

    return axios.get(url).then(function(res) {
        var result = new CurrentResult();

        if (res.data.query && res.data.query.results) {
            var data = {};
            if (Array.isArray(res.data.query.results) && res.data.query.results[0]) {
                data = res.data.query.results[0].channel;
            }
            else {
                data = res.data.query.results.channel;
            }

            if (data.item && data.item.condition && data.item.condition.temp && data.item.condition.code) {
                if (data.units.temperature == 'F') {
                    result.setTemperature(data.item.condition.temp, constants.FAHRENHEIT);
                }
                else {
                    result.setTemperature(data.item.condition.temp, constants.CELCIUS);
                }

                if (data.units.speed == 'mph') {
                    result.setWindSpeed(data.wind.speed, constants.MILES);
                }
                else {
                    result.setWindSpeed(data.wind.speed, constants.KILOMETERS);
                }

                result.setCondition(condition(data.item.condition.code));
                result.setSunrise(convertTime(data.astronomy.sunrise));
                result.setSunset(convertTime(data.astronomy.sunset));
                result.setHumidity(data.atmosphere.humidity);
                result.setRawResults(flatResults(data));
            }
            else {
                throw new MalformedResponse(constants.YAHOO);
            }
        }
        else {
            throw new MalformedResponse(constants.YAHOO);
        }

        return result;
    });
}

module.exports = {
    getCurrent: getCurrent,
};
