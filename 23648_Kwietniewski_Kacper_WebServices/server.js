const express = require("express");
const app = express();
const helmet = require("helmet");
const bodyParser = require("body-parser");

app.use(helmet());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

const runServer = (port) => {
  app.listen(port, () => {
    console.log(`Rest server is listening at http://localhost:${port}`);
  });
};

module.exports = {
  runServer,
  app,
};
