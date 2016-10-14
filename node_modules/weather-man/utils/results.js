var flatten = require('flat');

module.exports.mapResults = function(res, map) {

    var fl = flatten(res, { safe: false });

    return Object.keys(map).reduce(function(prev, curr) {
        prev[curr] = map[curr] && fl[map[curr]];
        return prev;
    }, {});
};