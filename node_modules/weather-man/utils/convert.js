var constants = require('./constants');

var DEGREES_KELVIN = 273.15;

function fToC(temp) {
    return (temp - 32) * 5 / 9;
}

function cToF(temp) {
    return (temp * 9 / 5) + 32;
}

function temperature(temp, from, to) {
    var value = temp;
    if (from == constants.KELVIN) {
        if (to == constants.CELCIUS) {
            value = temp - DEGREES_KELVIN;
        }
        else if (to == constants.FAHRENHEIT) {
            value = cToF(temp - DEGREES_KELVIN);
        }
    }
    else if (from == constants.CELCIUS) {
        if (to == constants.KELVIN) {
            value = temp + DEGREES_KELVIN;
        }
        else if (to == constants.FAHRENHEIT) {
            value = cToF(temp);
        }
    }
    else if (from == constants.FAHRENHEIT) {
        if (to == constants.KELVIN) {
            value = fToC(temp) + DEGREES_KELVIN;
        }
        else if (to == constants.CELCIUS) {
            value = fToC(temp);
        }
    }

    return value;
}

function distance(d, from, to) {
    var value = d;
    if (from == constants.KILOMETERS) {
        if (to == constants.MILES) {
            value = d * 0.621371;
        }
        else if (to == constants.METERS) {
            value = d * 0.277778;
        }
    }
    else if (from == constants.MILES) {
        if (to == constants.KILOMETERS) {
            value = d * 1.60934;
        }
        else if (to == constants.METERS) {
            value = d * 0.44704;
        }
    }
    else if (from == constants.METERS) {
        if (to == constants.KILOMETERS) {
            value = d * 3.6;
        }
        else if (to == constants.MILES) {
            value = d * 2.23694;
        }
    }

    return value;
}

module.exports = {
    temperature: temperature,
    distance: distance,
};
