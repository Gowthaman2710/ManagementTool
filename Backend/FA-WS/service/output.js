var fs = require("fs-extra")
const path = require("path")
const exec = require('child-process-promise').exec;
const rimraf = require('rimraf');
const findRemoveSync = require('find-remove')
// const report = require('./myreport');

var storage = {}
var projectPath = path.join(__dirname, '../../temp_script/')

storage.fileSetup = (req, res) => {
    return exec("cd " + projectPath + req.body.folderName + " && npm install").then((result) => {
        return "--Node modules installed--"
    }).catch((err) => {
        throw err;
    })
}

storage.testing = (req, res) => {

    try {
        fs.writeJSONSync('../temp_script/' + req.body.folderName + '/result.json', "");
    }
    catch (err) { }
    return exec("cd " + projectPath + req.body.folderName + " && npm test").then((result) => {
        return "--Testing completed--"
    }).catch((err) => {
        console.log("Error in testing", err.message);

        return "--Testing completed with Error--"
    })
}

storage.clearTraineeTest = (req, res) => {
    return new Promise((resolve) => {
        if (req.body.FA != "FA2") {
            dir = ""
            if (req.body.FA == "FA3-Angular") dir = "test/*"
            else if (req.body.FA == "FA3-React") dir = "App.test.js"
            rimraf(path.join(__dirname, '../../trainee_script/src/' + dir), () => {
                resolve("Cleared test in Trainee Folder")

            });
        } else {
            resolve("Ok")
        }
    })
}

storage.clearTempScript = (req, res) => {
    let path = ""
    if (req.body.FA == "FA2") path = "/src/*"
    else if (req.body.FA == "FA3-Angular") path = "/src/app/*"
    if (req.body.FA != "FA3-React") {
        return new Promise((resolve) => {
            rimraf(projectPath + req.body.folderName + path, () => {
                resolve("Cleared temp script src Folder")

            });
        })
    }
    if (req.body.FA == "FA3-React") {
        path = "/src"
        return new Promise((resolve,reject) => {
            let result = findRemoveSync(projectPath + req.body.folderName + path, {dir: "*", files: "*.*" ,ignore: 'App.test.js' })
            if(Object.keys(result).length)
                resolve("Cleared temp script src Folder")
            else
                reject("Unable to clear src of temp script / temp script src is empty")
        })
    }

}
storage.clearTraineeScript = (req, res) => {
    let traineePath = path.join(__dirname, '../../trainee_script/')
    return new Promise((resolve) => {
        rimraf(traineePath + "/*", () => {
            resolve("Cleared trainee script Folder")

        });
    })
}

storage.fetchMarks = (req, res) => {
    return Promise.resolve().then(() => {
        var markObj = null;
        var report = null
        try {
            markObj = fs.readJSONSync('../temp_script/marks.json')
        }
        catch (err) {
        }
        finally {
            console.log("--Parsing result--")
            req.body.markObj = markObj;
            try {
                if (req.body.empId != 'Educator') {
                    pickFolder = req.body.folderName
                }
                else {
                    pickFolder = req.body.folderName
                }
                report = fs.readJSONSync('../temp_script/' + pickFolder + '/result.json');

            } catch (e) { }
            finally {

                return report;
            }
        }
    }).then((report) => {
        return report;
    }).catch((err) => {
        throw err;
    })

}

module.exports = storage;