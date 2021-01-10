const formidable = require('formidable');
const fs = require('fs');
const parse = (data) => {
    data = data.replace(/\\n/g, "");
        let keyVal = '';
        let keyValTab = [];
        let isValue = true;
        let isBracket = false;
  
        for(let i = 0; i<data.length; i++){
          if(isValue == true&&data[i] != ';'){
            if(data[i+1] == ':'){
              keyVal += data[i]+'"';
            }else{
              keyVal += data[i];
            }
          }
          
          if(data[i] == ','){
            keyVal += '"';
          }
          if(data[i] == ";" && isBracket == true || data[i] == data[data.length-1] && isBracket == true){
            keyVal += '}';
            isBracket = false;
          }
          if(data[i] == ';' || data[i] == data[data.length-1]){
            isValue = false;
            keyValTab.push('"'+keyVal);
            keyVal = '';
            isValue = true;
          }
          let tmpChar = parseInt(data[i+1]);
          tmpChar = tmpChar.toString();
          if(data[i] == ":" && tmpChar == 'NaN'){ 
            keyVal += '{"';
            isBracket = true;
          }
        }
        return JSON.parse(`{${keyValTab}}`);
}

module.exports = {
    parse,
};