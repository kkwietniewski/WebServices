const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const yup = require('yup');
const formidable = require('formidable');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { decode } = require('querystring');
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/info', (req,res) =>{
  let author = require('./package.json');
  res.status(200);
  res.json({'author':author.author});
});

app.get('/hello/:name', (req,res) =>{
  let name = req.params.name;
  let schema = yup.string().max(10).matches(/^[a-zA-Z]+\s*$/)

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

const userData = [];
app.post('/store', (req,res)=>{
  userData.push(req.body.input);
  res.status(201);
  res.json({'Stored data':userData});
});

app.post('/parse', (req,res)=>{
  const form = formidable({multiples: true});
    form.parse(req, (err, fields, files)=>{
      let path = files.toParse.path;
      fs.readFile(path, 'utf8', (err, data)=>{
        data.trim();

        const parsers = require("./parsers");
        const result = parsers.parse(data);
        
        res.status(200);
        res.json(result);
      });
      
    });
  
});

app.get('/login', (req,res)=>{
  const loginData = require('./consts');

  if(req.body.login != loginData.LOGIN || req.body.password != loginData.PASSWORD){
    res.status(401);
    res.send('Błąd, podane dane są niepoprawne!');
  }else{
    let token = jwt.sign({secret: loginData.PRIVATE_KEY, 'login': loginData.LOGIN},'secret');
    res.json(token);
  }
});

app.get('/profile', (req,res) =>{
  //Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QifQ.nxl8hJZzl6cYUXx_3G38_q3ZHxxLPGlZ3sIPDpJxSO0, secret

  let token = req.headers.authorization;
  token = token.replace('Bearer ', '');
  let decoded = jwt.decode(token);
  let correctJson = {"login":"test"};

   if(JSON.stringify(decoded) == JSON.stringify(correctJson)){
    res.json(decoded);
   }else{
    res.status(401).send('Status 401 - Unauthorized!');
   }
  // jwt.verify(token, consts.PRIVATE_KEY, function (err, decoded) {
  //   if (err) {
  //     res.status(401);
  //     res.send("Invalid token");
  //   } else {
  //     res.status(200);
  //     res.json({ login: decoded.login });
  //   }
  // });
});