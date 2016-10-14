var axios = require('axios');
var CurrentAQIResult = require('../results/currentAQIResult');
var MalformedResponse = require('../utils/exceptions').MalformedResponse;
var constants = require('../utils/constants');

function getCurrent(lat, lng) {
    var url = 'http://mapidroid.aqicn.org/aqicn/services/geolocate/?autolocate&android&geo=1;' + lat + ';' + lng + ';gps&lang=en';
    return axios.get(url).then(function(res) {
        var result = new CurrentAQIResult();

        if (res.data.length > 0 && res.data[0]) {
            result.setAQI(parseInt(res.data[0].v));
            result.setLocation(res.data[0].nlo);
        }
        else {
            throw new MalformedResponse(constants.AQICN);
        }

        return result;
    });
}

module.exports = {
    getCurrent: getCurrent,
};
