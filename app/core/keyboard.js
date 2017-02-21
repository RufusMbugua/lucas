var keyboard = function (body){
  var response = body;

  message_parts = response.message.split("\n1");
  message = message_parts[0];

  if(Array.isArray(message_parts)){
    if(message_parts.length>1){
      keyboard_options = message_parts[1].split("\n")
      response.keyboard=[];
      keyboard_options.forEach(function(item,index){
        if(item=='Reply A to continue'){
          response.keyboard.push(['Continue']);
        }
        else{
          if(index==0){
            item = "1"+item
          }
          item = [item]
          response.keyboard.push(item)
        }
      })
    }
    else{
      response.keyboard=[['Continue']];
    }

  }
  response.message = body;
  return response;
}

module.exports = keyboard;
