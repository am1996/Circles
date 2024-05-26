let fs = require('fs');
let path = require("path");

function logger(req, res, next) {
    let accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), { flags: 'a' })
    const method = req.method;
    const url = req.url;
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'];
    const status = res.statusCode;
    accessLogStream.write(`${timestamp} - ${userAgent} - ${method} ${url} - ${status}`);
    next();
  }

  module.exports = logger;