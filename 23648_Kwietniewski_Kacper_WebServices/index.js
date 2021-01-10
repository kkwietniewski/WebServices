const { runServer, app } = require("./server");

const yup = require("yup");
const formidable = require("formidable");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { decode } = require("querystring");
const cors = require("cors");

runServer(3000);
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/info", (req, res) => {
  let author = require("./package.json");
  res.status(200);
  res.json({ author: author.author });
});

app.get("/hello/:name", (req, res) => {
  let name = req.params.name;
  let schema = yup
    .string()
    .max(10)
    .matches(/^[a-zA-Z]+\s*$/);

  if (schema.isValidSync(name)) {
    res.status(200);
    res.send("Hello " + name + "!");
  } else {
    res.status(400);
    res.send("Status 400 - Niepoprawne dane!");
  }
});

const userData = [];
app.post("/store", (req, res) => {
  userData.push(req.body.input);
  res.status(201);
  res.json({ "Stored data": userData });
});

app.post("/parse", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    let path = files.toParse.path;
    fs.readFile(path, "utf8", (err, data) => {
      data.trim();

      const parsers = require("./parsers");
      const result = parsers.parse(data);

      res.status(200);
      res.json(result);
    });
  });
});

app.get("/login", (req, res) => {
  const loginData = require("./consts");

  if (
    req.query.login != loginData.LOGIN ||
    req.query.password != loginData.PASSWORD
  ) {
    res.status(401);
    res.send("Błąd, podane dane są niepoprawne!");
  } else {
    let token = jwt.sign({ login: loginData.LOGIN }, loginData.PRIVATE_KEY);
    res.json(token);
  }
});

app.get("/profile", (req, res) => {
  //Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3QifQ.9IK78dv0QS2-ooKuajMhCZHi-wYjJPCAGbgrtn_uV9U
  const loginData = require("./consts");
  if (req.headers.authorization == null) {
    res.status(500);
    res.send("Token is missing!");
  } else {
    let token = req.headers.authorization;
    token = token.replace("Bearer ", "");
    jwt.verify(token, loginData.PRIVATE_KEY, function (err, decoded) {
      if (err) {
        res.status(401);
        res.send("Invalid token");
      } else {
        res.status(200);
        res.json({ login: decoded.login });
      }
    });
  }
});
