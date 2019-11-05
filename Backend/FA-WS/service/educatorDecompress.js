const path = require('path');
const decompress = require('decompress');
// const decompressUnzip = require('decompress-unzip');
const fsExtra = require("fs-extra");
var jsZip = require("jszip");

var educatorSolution = {}

//Educator Decompress Middleware
educatorSolution.decompress = function (req, res) {
    return Promise.resolve().then(() => {
        var sourcePath = req.body.path + "\\" + req.body.empId + ".zip";
        var folderName = "";
        if (req.body.empId == 'Educator') {
            folderName = 'solution'
        }
        else {
            folderName = 'trainee_script'
        }
        var destinationPath = path.join(__dirname, '../../' + folderName);
        var deliverable = ""

        try {
            deliverable = fsExtra.readFileSync(sourcePath)
        } catch (e) {
            console.log(e.message);
        } finally {
            if (deliverable) {
                return jsZip.loadAsync(deliverable).then(function (zip) {
                    files = Object.keys(zip.files);
                    if (files.length != 0) {
                        flag = 0;
                        try {

                            var rootFolder = "";
                            if (req.body.empId == 'Educator') {
                                rootFolder = files[0].split('/');
                                var pickFolder = req.body.folderName
                            }
                            else {
                                rootFolder = files[0].split('/');
                                var pickFolder = "src"
                            }
                            console.log(rootFolder);

                            if (rootFolder[0] == pickFolder) {
                                flag = 1;
                            }
                        }
                        catch (err) {
                            flag = 0;
                        }
                        finally {
                            if (flag) {
                                return decompress(sourcePath, destinationPath).then(files => {
                                    return "--Script decompressed--" + req.body.empId
                                }).catch((err) => {
                                    throw new Error(req.body.empId + " not found!")
                                })
                            }
                            else {
                                try {
                                    fsExtra.appendFileSync("../results/improperStructure.txt", req.body.empId + "\n")
                                }
                                catch (err) {
                                }
                                finally {
                                    throw new Error("Directory structure incorrect ---" + req.body.empId)
                                }
                            }
                        }
                    }
                });
            }
            else {
                throw "Path Not found"
            }

        }
    })
}

//Creating temp file
educatorSolution.makeTempsolution = function (req, res) {
    if (req.body.empId == 'Educator') {
        folderName = 'solution'
        destination = path.join(__dirname, "../../temp_script")
    }
    else {
        let dir = ""
        if (req.body.FA == "FA2") dir = "/src/"
        else if (req.body.FA == "FA3-Angular") dir = "/src/app/"
        else if (req.body.FA == "FA3-React") dir = "/src/"
        folderName = 'trainee_script' + dir
        destination = path.join(__dirname, "../../temp_script/" + req.body.folderName + dir);
    }
    source = path.join(__dirname, "../../" + folderName);
    return fsExtra.copy(source, destination).then(() => {
        return "--Temporary file created--" + req.body.empId
    }).catch((err) => {
        throw err;
    })
}

module.exports = educatorSolution;
