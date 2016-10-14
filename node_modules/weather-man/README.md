# WeatherMan

A JavaScript weather library with multiple weather povider options. Currently it
supports the following weather providers: Yahoo, OpenWeatherMap, YR.no, Dark Sky (formerly Forecast.io),
and AQICN.org (for air quality data). Use it in NodeJS, the browser, the command
line or even with your Pebble app!

## Install

* For JavaScript usage: `npm install --save weather-man`
* For CLI usage: `npm install -g weather-man`

## Usage

### NodeJS

~~~
var WeatherMan = require('weather-man');

var wm = new WeatherMan(WeatherMan, 'apikey');
wm.getCurrent(latitude, longitude).then(function(result) {
    //If the result is for weather
    console.log(result.getTemperature(WeatherMan.CELCIUS));
    console.log(result.getWindChill(WeatherMan.FAHRENHEIT));
    console.log(result.getHeatIndex(WeatherMan.KELVIN));
    console.log(result.getWindSpeed(WeatherMan.MILES)); //Or WeatherMan.KILOMETERS or WeatherMan.METERS
    console.log(result.getHumidity());
    console.log(result.getCondition());
    console.log(result.getSunrise());
    console.log(result.getSunset());

    //If the result is for air quality
    console.log('AQI: ' + result.getAQI());
    console.log('Location: ' + result.getLocation());
    console.log('AQI String: ' + result.getAQIString());
    console.log('AQI Color: ' + result.getAQIColor());
});
~~~

### Browser & PebbleKit

Grab a copy of example/weather-man.js and include it in your project, then
follow the NodeJS example.

### CLI

`weatherman --provider=darksky --lat=123 --lng=456 --units=f --apikey=apikey`

## License

Copyright (C) 2016 [Brian Douglass](http://bhdouglass.com/)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3, as published
by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranties of MERCHANTABILITY, SATISFACTORY QUALITY, or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.  If not, see <http://www.gnu.org/licenses/>.
