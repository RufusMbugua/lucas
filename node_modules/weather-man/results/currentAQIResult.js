var CurrentAQIResult = function() {
    this.aqi = 0;
    this.location = '';
};

CurrentAQIResult.prototype.setAQI = function(aqi) {
    this.aqi = aqi ? parseFloat(aqi) : 0;
};

CurrentAQIResult.prototype.setLocation = function(location) {
    this.location = location;
};

CurrentAQIResult.prototype.getAQI = function() {
    return this.aqi;
};

CurrentAQIResult.prototype.getAQIString = function() {
    var value = 'Hazardous';

    if (this.aqi <= 50) {
        value = 'Good';
    }
    else if (this.aqi > 50 && this.aqi <= 100) {
        value = 'Moderate';
    }
    else if (this.aqi > 100 && this.aqi <= 150) {
        value = 'Unhealthy for Sensitive Groups';
    }
    else if (this.aqi > 150 && this.aqi <= 200) {
        value = 'Unhealthy';
    }
    else if (this.aqi > 200 && this.aqi <= 300) {
        value = 'Very Unhealthy';
    }

    return value;
};

CurrentAQIResult.prototype.getAQIColor = function() {
    var value = '7E0023';

    if (this.aqi <= 50) {
        value = '00E400';
    }
    else if (this.aqi > 50 && this.aqi <= 100) {
        value = 'FFFF00';
    }
    else if (this.aqi > 100 && this.aqi <= 150) {
        value = 'FF7E00';
    }
    else if (this.aqi > 150 && this.aqi <= 200) {
        value = 'FF0000';
    }
    else if (this.aqi > 200 && this.aqi <= 300) {
        value = '99004C';
    }

    return value;
};

CurrentAQIResult.prototype.getLocation = function() {
    return this.location;
};

module.exports = CurrentAQIResult;
