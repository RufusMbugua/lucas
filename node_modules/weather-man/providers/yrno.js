var axios = require('axios');
var moment = require('moment');
var X2JS = require('x2js');
var CurrentResult = require('../results/currentResult');
var MalformedResponse = require('../utils/exceptions').MalformedResponse;
var constants = require('../utils/constants');
var results = require('../utils/results');

//Reference: http://api.yr.no/weatherapi/weathericon/1.1/documentation
function condition(code) {
    var returnCode = constants.CLEAR;

    if (code > 100) {
        code -= 100;
    }

    var map = {
        1: constants.CLEAR, //1 Sun
        2: constants.CLOUDY, //2 LightCloud
        3: constants.CLOUDY, //3 PartlyCloud
        4: constants.CLOUDY, //4 Cloud
        5: constants.LIGHT_RAIN, //5 LightRainSun
        6: constants.THUNDERSTORM, //6 LightRainThunderSun
        7: constants.SNOW, //7 SleetSun
        8: constants.SNOW, //8 SnowSun
        9: constants.LIGHT_RAIN, //9 LightRain
        10: constants.RAIN, //10 Rain
        11: constants.THUNDERSTORM, //11 RainThunder
        12: constants.SNOW, //12 Sleet
        13: constants.SNOW, //13 Snow
        14: constants.SNOW_THUNDERSTORM, //14 SnowThunder
        15: constants.FOG, //15 Fog
        20: constants.SNOW_THUNDERSTORM, //20 SleetSunThunder
        21: constants.SNOW_THUNDERSTORM, //21 SnowSunThunder
        22: constants.THUNDERSTORM, //22 LightRainThunder
        23: constants.SNOW_THUNDERSTORM, //23 SleetThunder
        24: constants.THUNDERSTORM, //24 DrizzleThunderSun
        25: constants.THUNDERSTORM, //25 RainThunderSun
        26: constants.SNOW_THUNDERSTORM, //26 LightSleetThunderSun
        27: constants.SNOW_THUNDERSTORM, //27 HeavySleetThunderSun
        28: constants.SNOW_THUNDERSTORM, //28 LightSnowThunderSun
        29: constants.SNOW_THUNDERSTORM, //29 HeavySnowThunderSun
        30: constants.THUNDERSTORM, //30 DrizzleThunder
        31: constants.SNOW_THUNDERSTORM, //31 LightSleetThunder
        32: constants.SNOW_THUNDERSTORM, //32 HeavySleetThunder
        33: constants.SNOW_THUNDERSTORM, //33 LightSnowThunder
        34: constants.SNOW_THUNDERSTORM, //34 HeavySnowThunder
        40: constants.LIGHT_RAIN, //40 DrizzleSun
        41: constants.RAIN, //41 RainSun
        42: constants.SNOW, //42 LightSleetSun
        43: constants.SNOW, //43 HeavySleetSun
        44: constants.SNOW, //44 LightSnowSun
        45: constants.SNOW, //45 HeavysnowSun
        46: constants.LIGHT_RAIN, //46 Drizzle
        47: constants.SNOW, //47 LightSleet
        48: constants.SNOW, //48 HeavySleet
        49: constants.SNOW, //49 LightSnow
        50: constants.SNOW, //50 HeavySnow
    };

    if (map[code]) {
        returnCode = map[code];
    }

    return returnCode;
}

function flatResults(res) {

    var map = {};

    map[constants.LAT] = '_latitude';
    map[constants.LON] = '_longitude';
    map[constants.TEMP] = 'temperature._value';
    map[constants.CODE] = 'symbol._number';
    map[constants.SUMMARY] = 'symbol._id';
    map[constants.HUMIDITY] = 'humidity._value';
    map[constants.PRESSURE] = 'pressure._value';
    map[constants.SUNRISE] = '_sunrise';
    map[constants.SUNSET] = '_sunset';
    map[constants.WIND_SPEED] = 'windSpeed._mps';
    map[constants.WIND_DIR] = 'windDirection._deg';

    return results.mapResults(res, map);
}

function convertTime(timestamp) {
    var date = new Date(timestamp);
    return date.getHours() * 60 + date.getMinutes();
}

function getCurrent(lat, lng, apiKey, getSunrise) {
    getSunrise = (getSunrise === undefined) ? true : getSunrise;
    var x2js = new X2JS();

    var url = 'http://api.yr.no/weatherapi/locationforecast/1.9/?lat=' + lat + ';lon=' + lng;
    return axios.get(url).then(function(res) {
        var result = new CurrentResult();
        var json = x2js.xml2js(res.data);

        if (json.weatherdata && json.weatherdata.product && json.weatherdata.product.time) {
            var simple = [];
            var full = [];
            for (var index in json.weatherdata.product.time) {
                if (json.weatherdata.product.time[index].location.symbol) {
                    simple.push(json.weatherdata.product.time[index]);
                }
                else {
                    full.push(json.weatherdata.product.time[index]);
                }
            }

            //From https://github.com/evanshortiss/yr.no-forecast
            var simpleWeather = null;
            var fullWeather = null;
            var maxDifference = Infinity;
            var now = moment.utc(Date.now());

            for (var i in simple) {
                var to = moment.utc(simple[i]._to);
                var from = moment.utc(simple[i]._from);

                if ((from.isSame(now) || from.isBefore(now)) && (to.isSame(now) || to.isAfter(now))) {
                    var diff = Math.abs(to.diff(from));
                    if (diff < maxDifference) {
                        maxDifference = diff;
                        simpleWeather = simple[i];
                    }
                }
            }

            maxDifference = Infinity;
            for (var f in full) {
                var difference = Math.abs(moment.utc(full[f].to).diff(now));
                if (difference < maxDifference) {
                    maxDifference = difference;
                    fullWeather = full[f];
                }
            }

            if (!fullWeather) {
                fullWeather = simpleWeather;
            }
            else if (simpleWeather) {
                for (var key in simpleWeather.location) {
                    fullWeather.location[key] = simpleWeather.location[key];
                }
            }

            if (fullWeather && fullWeather.location) {
                if (fullWeather.location.temperature && fullWeather.location.temperature._value) {
                    result.setTemperature(parseInt(fullWeather.location.temperature._value), constants.CELCIUS);
                }
                else {
                    throw new MalformedResponse(constants.YRNO, 'Missing temperature data');
                }

                if (fullWeather.location.symbol && fullWeather.location.symbol._number) {
                    result.setCondition(condition(parseInt(fullWeather.location.symbol._number)));
                }
                else {
                    throw new MalformedResponse(constants.YRNO, 'Missing conditon data');
                }

                if (fullWeather.location.windSpeed && fullWeather.location.windSpeed._mps) {
                    result.setWindSpeed(parseFloat(fullWeather.location.windSpeed._mps), constants.METERS);
                }

                if (fullWeather.location.humidity && fullWeather.location.humidity._value && fullWeather.location.humidity._unit == 'percent') {
                    result.setHumidity(parseFloat(fullWeather.location.humidity._value));
                }

                if (getSunrise) {
                    var surl = 'http://api.yr.no/weatherapi/sunrise/1.1/?lat=' + lat + ';lon=' + lng + ';date=' + moment().format('YYYY-MM-DD');
                    return axios.get(surl).then(function(res) {
                        var sjson = x2js.xml2js(res.data);
                        if (sjson.astrodata && sjson.astrodata.time && sjson.astrodata.time.location && sjson.astrodata.time.location.sun) {
                            result.setSunrise(convertTime(sjson.astrodata.time.location.sun._rise));
                            result.setSunset(convertTime(sjson.astrodata.time.location.sun._set));
                        }

                        fullWeather.location._sunrise = fullWeather.location._sunrise || sjson.astrodata.time.location.sun._rise;
                        fullWeather.location._sunset = fullWeather.location._sunset || sjson.astrodata.time.location.sun._set;

                        result.setRawResults(flatResults(fullWeather.location));

                        return result;
                    });
                } else {
                    result.setRawResults(flatResults(fullWeather.location));
                }
            }
            else {
                throw new MalformedResponse(constants.YRNO, 'Could not find weather data');
            }
        }
        else {
            throw new MalformedResponse(constants.YRNO);
        }

        return result;
    });
}

module.exports = {
    getCurrent: getCurrent,
};
