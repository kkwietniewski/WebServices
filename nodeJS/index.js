const express = require('express')
const helmet = require('helmet')
var bodyParser = require('body-parser')
const app = express()
const port = 3000
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/soap', (req,res) =>{
    res.send('You got POST request on /soap');
})

app.post('/rest', (req,res) =>{
    res.send('You got POST request on /rest');
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.use(helmet())

app.use(bodyParser.urlencoded({extended:false}))

app.use(bodyParser.json())

app.use(function(req,res){
    res.setHeader('Content-Type', 'text/plain')
    res.write('Your username: ')
    res.end(JSON.stringify(req.body.username,null,2))
})

// var jsonParser = bodyParser.json()

// var urlencodedParser = bodyParser.urlencoded({extended:false})

// app.post('/login', urlencodedParser, function(req, res){
//     res.send('Welcome, '+req.body.username)
// })


// app.post('/api/users', jsonParser, function(req, res){
////code userAdd
// })