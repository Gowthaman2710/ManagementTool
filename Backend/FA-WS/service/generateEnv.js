
const fs = require('fs-extra');
const path = require('path');


module.exports = function (req, res) {
    return Promise.resolve().then(() => {
        const folders = {
            solution: path.join(__dirname, '../../solution'),
            traineeScript: path.join(__dirname, '../../trainee_script'),
            tempScript: path.join(__dirname, '../../temp_script'),
            results: path.join(__dirname,'../../results')
        }
        for (const iterator in folders) {
            fs.ensureDirSync(folders[iterator])
        }
        return "--Environment created--"
    }).then((data) => {
        return data
    })
}
