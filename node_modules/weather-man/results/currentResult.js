var constants = require('../utils/constants');
var convert = require('../utils/convert');

var CurrentResult = function() {
    this.temperatureUnits = constants.KELVIN;
    this.temperature = 0;
    this.windSpeedUnits = constants.KILOMETERS;
    this.windSpeed = 0;
    this.condition = constants.CLEAR;
    this.humidity = 0;
    this.sunrise = 1;
    this.sunset = 0;
    this.rawResults = {};
};

CurrentResult.prototype.setTemperature = function(temp, units) {
    this.temperature = temp ? parseFloat(temp) : 0;
    this.temperatureUnits = units ? units : constants.KELVIN;
};

CurrentResult.prototype.setWindSpeed = function(speed, units) {
    this.windSpeed = speed ? parseFloat(speed) : 0;
    this.windSpeedUnits = units ? units : constants.KILOMETERS;
};

CurrentResult.prototype.setCondition = function(condition) {
    this.condition = condition ? condition : constants.CLEAR;
};

CurrentResult.prototype.setHumidity = function(humidity) {
    this.humidity = humidity ? parseFloat(humidity) : 0;
};

CurrentResult.prototype.setSunrise = function(sunrise) {
    this.sunrise = (sunrise === null || sunrise === undefined) ? 1 : parseInt(sunrise);
};

CurrentResult.prototype.setSunset = function(sunset) {
    this.sunset = (sunset === null || sunset === undefined) ? 0 : parseInt(sunset);
};

CurrentResult.prototype.setRawResults = function(results) {
    this.rawResults = results || {};
};

CurrentResult.prototype.getTemperature = function(units, temp) {
    return convert.temperature(temp || this.temperature, this.temperatureUnits, units);
};

CurrentResult.prototype.getWindSpeed = function(units) {
    return convert.distance(this.windSpeed, this.windSpeedUnits, units);
};

CurrentResult.prototype.getCondition = function() {
    return this.condition;
};

CurrentResult.prototype.getHumidity = function() {
    return this.humidity;
};

CurrentResult.prototype.minutesToDate = function(time) {
    var minutes = time % 60;
    var hours = Math.round((time - minutes) / 60);

    var date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date;
};

CurrentResult.prototype.formatMinutes = function(time, ampm) {
    var minutes = time % 60;
    var hours = Math.round((time - minutes) / 60);
    var am = (hours < 12);

    var formatted = hours + ':' + minutes;
    if (ampm == constants.AMPM) {
        if (!am) {
            hours -= 12;
        }

        formatted = hours + ':' + minutes + ' ' + (am ? 'am' : 'pm');
    }

    return formatted;
}

CurrentResult.prototype.getSunrise = function() {
    return this.sunrise;
};

CurrentResult.prototype.getSunriseDate = function() {
    return this.minutesToDate(this.getSunrise());
};

CurrentResult.prototype.getSunriseFormatted = function(ampm) {
    return this.formatMinutes(this.getSunrise(), ampm);
};

CurrentResult.prototype.getSunset = function() {
    return this.sunset;
};

CurrentResult.prototype.getSunsetDate = function() {
    return this.minutesToDate(this.getSunset());
};

CurrentResult.prototype.getSunsetFormatted = function(ampm) {
    return this.formatMinutes(this.getSunset(), ampm);
};

CurrentResult.prototype.getWindChill = function(units) {
    var temp = this.getTemperature(constants.CELCIUS);
    var v = Math.pow(this.getWindSpeed(constants.KILOMETERS), 0.16);
    var windchill = 13.12 + 0.6215 * temp - 11.37 * v + 0.3965 * temp * v;

    return convert.temperature(windchill, constants.CELCIUS, units);
};

CurrentResult.prototype.getHeatIndex = function(units) {
    var temp = this.getTemperature(constants.FAHRENHEIT);
    var humidity = this.getHumidity();

    var heatIndex = temp;
    if (temp >= 80 && humidity >= 40) {
        var tsq = Math.pow(temp, 2);
        var hsq = Math.pow(humidity, 2);
        var c = [
            null, //not used
            -42.379,
            2.04901523,
            10.14333127,
            -0.22475541,
            -0.00683783,
            -0.05481717,
            0.00122874,
            0.00085282,
            -0.00000199
        ];

        heatIndex = c[1] +
            (c[2]* temp) +
            (c[3]* humidity) +
            (c[4]* temp * humidity) +
            (c[5]* tsq) +
            (c[6]* hsq) +
            (c[7]* tsq * humidity) +
            (c[8]* temp * hsq) +
            (c[9]* tsq * hsq);
    }

    return convert.temperature(heatIndex, constants.FAHRENHEIT, units);
};

CurrentResult.prototype.getRawResults = function() {
    return this.rawResults;
};

module.exports = CurrentResult;
