var async = require('async');
// request
var request = require('request');
var promise = require('promise');
var keyboard = require('./keyboard');

require('promise/lib/rejection-tracking').enable();

var processMessage = function (update,url,channel){
var options = {};

options = {
 url : url+'/wards/search',
 qs : {
   county:update.text,
   type:'county'
 }
}

  var promise = new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      try{
        body = JSON.parse(body).join(', ')
        result = body

        if (error) reject(error);
            else resolve(result);
      }
      catch(e){
        console.log(e)
      }
    })
  });

  return promise;
}

module.exports = processMessage;
