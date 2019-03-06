const Disassembler = require('./lib/disassembler');

const winston      = require('winston');
const http         = require('http');
const port         = process.env.PORT || 3000;
const env          = process.env.NODE_ENV || 'dev';
const express      = require('express');
const bodyParser   = require('body-parser');

// configure express
const app          = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const logger = winston.createLogger({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: `./logs/${env}.log` })
  ]
});

const handlePost = (req, res) => {
  const disassembler = new Disassembler(logger);
  const code = req.body.code;
  const version = req.body.version;
  const done = function(returnObj) {
    res.send(returnObj);
  };
  disassembler.run({code, version, done});
};

app.use(express.static('public'))
app.post('/', handlePost);

app.listen(port, function () {
  console.log(`Server running at http://0.0.0.0:${port}/`);
});
