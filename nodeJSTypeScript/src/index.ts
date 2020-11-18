import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import path from "path";
import { type } from "os";
const yup = require('yup');
const formidable = require('formidable');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { decode } = require('querystring');
const app = express();
const port = 3000;


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/info', (req,res) =>{
  let author = require('./package.json');
  res.json({'author':author.author});
  res.status(200);
});

app.get('/hello/:name', (req,res) =>{
  let name = req.params.name;
  let schema = yup.string().max(10).matches(/^[a-zA-Z]+$/)

  if(schema.isValidSync(name)){
    res.status(200);
    res.send('Hello '+name+'!');
  }else{
    res.status(400);
    res.send('Status 400 - Niepoprawne dane!');
  }
});

app.post('/soap', (req,res) =>{
    res.send('You got POST request on /soap');
});

app.post('/rest', (req,res) =>{
    res.send('You got POST request on /rest');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.use(helmet());

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

let userData:Array<object> = [];
app.post('/store', (req,res)=>{
  userData.push(req.body.input);
  res.json({'Stored data':userData});
  res.status(201);
});

app.post('/parse', (req,res)=>{
  const form = formidable({multiples: true});
  form.parse(req, (err:Error, field:any, files:any)=>{
    let path = files.toParse.path;
    console.log(typeof(files))
    fs.readFile(path, 'utf8', (err:Error, data:String)=>{
      data.trim();
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
        // console.log(keyVal);
        let tmpVal = parseInt(data[i+1]);
        let tmpChar = tmpVal.toString();
        if(data[i] == ":" && tmpChar == "NaN"){ 
          keyVal += '{"';
          isBracket = true;
        }
        // console.log(keyVal);
      }
      
    //   console.log(keyValTab);
      res.json(JSON.parse(`{${keyValTab}}`));
      res.status(200);
    });
    
  });
});

app.get('/login', (req,res)=>{
  let login = 'login';
  let password = 'password';

  if(req.body.login != login || req.body.password != password){
    res.status(401);
    res.send('Błąd, podane dane są niepoprawne!');
  }else{
    let token = jwt.sign({secret: 'testSecret', 'login': login},'secret');
    res.json(token);
  }
});

app.get('/profile', (req,res) =>{
  //Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QifQ.nxl8hJZzl6cYUXx_3G38_q3ZHxxLPGlZ3sIPDpJxSO0, secret

  let token = String(req.headers.authorization);
  token = token.replace('Bearer ', '');
  let decoded = jwt.decode(token);
  let correctJson = {"login":"test"};

   if(JSON.stringify(decoded) == JSON.stringify(correctJson)){
    res.json(decoded);
   }else{
     res.sendStatus(401);
   }
});