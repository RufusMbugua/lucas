var axios = require('axios');
var CurrentResult = require('../results/currentResult');
var MalformedResponse = require('../utils/exceptions').MalformedResponse;
var constants = require('../utils/constants');
var results = require('../utils/results');

function condition(code) {
    var returnCode = constants.CLEAR;
    if (code == 800 || code == 951) { //Clear/Calm
        returnCode = constants.CLEAR;
    }
    else if (code > 800 && code < 900) { //Clouds
        returnCode = constants.CLOUDY;
    }
    else if (code >= 700 && code < 800) { //Atmosphere (mist, fog, etc)
        returnCode = constants.FOG;
    }
    else if (code >= 300 && code < 400) { //Drizzle
        returnCode = constants.LIGHT_RAIN;
    }
    else if (code >= 500 && code < 600) { //Rain
        returnCode = constants.RAIN;
    }
    else if (code >= 200 && code < 300) { //Thunderstorm
        returnCode = constants.THUNDERSTORM;
    }
    else if (code >= 600 && code < 700) { //Snow
        returnCode = constants.SNOW;
    }
    else if (code == 906) { //Hail
        returnCode = constants.HAIL;
    }
    else if (code >= 907 && code < 957) { //Wind
        returnCode = constants.WIND;
    }
    else if (code == 905 || (code >= 957 && code < 1000)) { //Extreme Wind
        returnCode = constants.EXTREME_WIND;
    }
    else if (code == 900) { //Tornado
        returnCode = constants.TORNADO;
    }
    else if (code == 901 || code == 902 || code == 962) { //Hurricane
        returnCode = constants.HURRICANE;
    }
    else if (code == 903) { //Extreme cold
        returnCode = constants.EXTREME_COLD;
    }
    else if (code == 904) { //Extreme heat
        returnCode = constants.EXTREME_HEAT;
    }

    return returnCode;
}

function flatResults(res) {

    var map = {};

    map[constants.LAT] = 'coord.lat';
    map[constants.LON] = 'coord.lon';
    map[constants.TEMP] = 'main.temp';
    map[constants.MAX] = 'main.temp_max';
    map[constants.MIN] = 'main.temp_min';
    map[constants.CODE] = 'weather.0.id';
    map[constants.SUMMARY] = 'weather.0.main';
    map[constants.HUMIDITY] = 'main.humidity';
    map[constants.PRESSURE] = 'main.pressure';
    map[constants.VISIBILITY] = 'visibility.value';
    map[constants.SUNRISE] = 'sys.sunrise';
    map[constants.SUNSET] = 'sys.sunset';
    map[constants.WIND_SPEED] = 'wind.speed';
    map[constants.WIND_DIR] = 'wind.deg';

    return results.mapResults(res, map);
}

function convertTime(timestamp) {
    var date = new Date(timestamp * 1000);
    return date.getHours() * 60 + date.getMinutes();
}

function getCurrent(lat, lng, apiKey) {
    var url = 'http://api.openweathermap.org/data/2.5/weather?APPID=' + apiKey + '&lat=' + lat + '&lon=' + lng + '&units=metric';
    return axios.get(url).then(function(res) {
        var result = new CurrentResult();

        if (res.data.main && res.data.weather && res.data.weather[0] && res.data.sys) {
            result.setTemperature(res.data.main.temp, constants.CELCIUS);
            result.setCondition(condition(res.data.weather[0].id));
            result.setSunrise(convertTime(res.data.sys.sunrise));
            result.setSunset(convertTime(res.data.sys.sunset));
            result.setHumidity(res.data.main.humidity);
            result.setWindSpeed(res.data.wind.speed, constants.KILOMETERS);
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
