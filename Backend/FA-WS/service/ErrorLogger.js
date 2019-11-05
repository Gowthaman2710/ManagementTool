var fs = require('fs');

var logger = function (err, req, res, next) {
    if (err) {
        fs.appendFile('ErrorLogger.txt', new Date() + " - " + err.stack + "\n", function (err) {
            if (err) {
                console.log("Failed in logging error");
            }
        });
        res.status(500);
        res.json({ "message": err.message })
    }
    next();
}

module.exports = logger;