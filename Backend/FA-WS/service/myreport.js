const fs = require('fs-extra');
// const database = require("../../FA-DB/db")
// var reportObj;

class Report {
    constructor(empId, totalTestCase, totalPass, totalMark, module) {
        this.empId = empId;
        this.testCount = totalTestCase;
        this.passCount = totalPass;
        this.totalMark = totalMark;
        this.module = module;
    }
}

class Module {
    constructor(testId, testCaseName, status, marks) {
        this.testId = testId;
        this.testCaseName = testCaseName;
        this.status = status;
        this.marks = marks;
    }
}

exports.parser = (data, req, res) => {
    if (data) {
        if (req.body.FA == "FA2") { data = nodeReport(data, req, res) }
        else if (req.body.FA == "FA3-Angular") { data = angularReport(data, req, res) }
        else if (req.body.FA == "FA3-React") { data = reactReport(data, req, res) }
        data = reportGenerator(data, req, res)
        if (req.body.empId != "Educator") {
            return data 
        }
    }
    else {
        return compErr(req, res)

    }
}

function compErr(req, res) {
    modules = []
    modules.push(new Module("NA", "Compilation error", "Compilation error", 0));
    evaluationResult = new Report(req.body.empId, 0, 0, 0, modules)
    var data = JSON.stringify(evaluationResult)
    data = reportGenerator(data, req, res)
    if (req.body.empId != "Educator") {
        return data
    }
    else return req.body.empId
}

function reportGenerator(data, req, res) {
    
    if (data != null) {
        if (req.body.empId == "Educator")
            res.send(data);
        else {
            fs.writeFileSync("../results/" + req.body.empId + ".json", data)
            return JSON.parse(data)
        }
    }
    else {
        console.log("All test cases have not been executed!");
        return req.body.empId
    }
}

//Report generator for node project
function nodeReport(reportObj, req, res) {
    var modules = [];
    var totalmark = 0;
    var markObj = req.body.markObj;
    if (reportObj) {
        for (let suiteName of reportObj.suites) {
            for (iterator of suiteName.tests) {
                var mark = 0
                let title = iterator.title.split('-');
                if (iterator.result == "passed") {
                    if (markObj) {
                        mark = markObj[title[0]];
                        totalmark += mark
                    }
                }
                modules.push(new Module(title[0], title[1], iterator.result, mark))
            }
        }
    }
    else {
        modules.push(new Module("NA", "Compilation error", "Compilation error", 0));
    }
    var sumTest = reportObj.stats.passes + reportObj.stats.pending + reportObj.stats.failures;
    console.log(sumTest, reportObj.stats.passes);

    if (reportObj.stats.tests == sumTest) {
        evaluationResult = new Report(req.body.empId, reportObj.stats.tests, reportObj.stats.passes, totalmark, modules)
        return JSON.stringify(evaluationResult)
    }
    else {
        return null;
    }
}


//Report generator for angular
function angularReport(reportObj, req, res) {
    var modules = [];
    var totalmark = 0;
    var markObj = req.body.markObj;
    if (reportObj) {
        var { browser, results } = reportObj.browsers[0]
        for (iterator of results) {
            var mark = 0
            let title = iterator.description.split('-');
            if (iterator.success) {
                if (markObj) {
                    mark = markObj[title[0]];
                    totalmark += mark
                }
            }
            modules.push(new Module(title[0], title[1], iterator.result, mark))
        }

    }
    else {
        modules.push(new Module("NA", "Compilation error", "Compilation error", 0));
    }
    let { success, skipped, failed, total } = browser.lastResult
    var sumTest = success + failed + skipped;
    console.log("total test", sumTest, "passed", success);
    if (total == sumTest) {
        evaluationResult = new Report(req.body.empId, total, success, totalmark, modules)
        return JSON.stringify(evaluationResult)
    }
    else {
        return null;
    }
}

function reactReport(reportObj, req, res) {
    var modules = [];
    var totalmark = 0;
    var markObj = req.body.markObj;
    
    if (reportObj) {
        let { numPassedTests, numFailedTests, numPendingTests, numTotalTests } = reportObj
        for (iterator of reportObj.testResults[0].assertionResults) {
			let mark = 0
            let title = iterator.title.split('-');
            if (iterator.status == "passed") {
                if (markObj) {
                    mark = markObj[title[0]];
                    totalmark += mark
                }
                else {
                    console.log("No marks allocated yet")
                }
                
            }
			modules.push(new Module(title[0], title[1], iterator.status, mark))

        }
        var sumTest = numPassedTests + numFailedTests + numPendingTests;
        console.log("total test", sumTest, "passed", numPassedTests)
        if (numTotalTests == sumTest) {
            evaluationResult = new Report(req.body.empId, numTotalTests, numPassedTests, totalmark, modules)
            return JSON.stringify(evaluationResult)
        }
        else {
            return null;
        }
    }
    else {
        modules.push(new Module("NA", "Compilation error", "Compilation error", 0));
    }
}