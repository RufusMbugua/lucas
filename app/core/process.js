var async = require('async');
// request
var request = require('request');
var promise = require('promise');
var keyboard = require('./keyboard');

require('promise/lib/rejection-tracking').enable();

var processMessage = function (update,url,channel){
var options = {};
  switch(channel){
    case 'telegram':
     options = {
      url : url,
      qs : {
        from:update.chat.id,
        sms_gateway_id:'',
        message:update.text,
        msg_id:1
      }
    }
    break;

    case 'twitter':
     options = {
      url : url,
      qs : {
        from:update.sender.id,
        sms_gateway_id:'',
        message:update.message.text,
        msg_id:1
      }
    }
    break;

    case 'slack':
     options = {
      url : url,
      qs : {
        from:update.user,
        sms_gateway_id:'',
        message:update.text,
        msg_id:1
      }
    }
    break;
  }


  var promise = new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      try{
        body = JSON.parse(body)
        if(channel != 'slack'){
          result = keyboard(body)
        }
        else{
          result = body
        }


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
