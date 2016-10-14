var MalformedResponse = function(provider, details) {
    this.name = 'MalformedResponse';
    this.message = 'Malformed response fetching data from ' + provider;

    if (details) {
        this.details = details;
    }
};

var InvalidProvider = function(provider) {
    this.name = 'InvalidProvider';
    this.message = 'Invalid provider "' + provider + '"';
};

module.exports = {
    MalformedResponse: MalformedResponse,
    InvalidProvider: InvalidProvider,
};
