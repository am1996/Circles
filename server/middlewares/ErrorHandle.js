let fs = require('fs');
let path = require("path");

function ErrorHandle(err, req, res, next){
    let accessLogStream = fs.createWriteStream(path.join(__dirname, '../log/access.log'), { flags: 'a' })
    accessLogStream.write(err.stack); // Log the error details
    res.status(500).send({"Error":'Internal Server Error'}); // Send a generic error message
}

module.exports = ErrorHandle;