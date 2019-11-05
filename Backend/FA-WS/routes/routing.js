const express = require('express');
const router = express.Router();
const jsonReport = require('../service/myreport')
const createFolders = require('../service/generateEnv');
const testunzip = require("../service/educatorDecompress");
const storage = require("../service/output");
const fs = require("fs");
const asyncLoop = require('node-async-loop');
const database = require("../../FA-DB/db")

// // POST request for uploading solution
let stats = true
router.put('/educator', (req, res, next) => {
  if (stats) {
    stats = false;
    return createFolders(req, res).then((msg) => {
      console.log(msg);
      return testunzip.decompress(req, res).then((msg) => {
        console.log(msg);
        return testunzip.makeTempsolution(req, res).then((msg) => {
          console.log(msg);
          return storage.fileSetup(req, res).then((msg) => {
            console.log(msg);
            return storage.testing(req, res).then((msg) => {
              console.log(msg);
              return storage.fetchMarks(req, res).then((data) => {
                jsonReport.parser(data, req, res)
                stats = true;
              })
            })
          })
        })
      })
    }).catch((err) => {
      console.log(err.message)
      next(err);
    })
  }
});



router.post("/marks", (req, res, next) => {
  fs.writeFile("../temp_script/marks.json", JSON.stringify(req.body), 'utf8', (err) => {
    if (!err) {
      res.json("Marks Json Created")
    } else {
      throw new Error("Marks Json not Created")
    }
  })
})



let Traineestats = true

router.post("/trainee", (req, res, next) => {

  if (Traineestats) {
    Traineestats = false;
    var empList = req.body.empList;
    var scriptCount = 0
    asyncLoop(empList, (empId, next) => {
      req.body.empId = empId;
      console.log("started Script", "empId : " + empId);
      return testunzip.decompress(req, res).then((msg) => {
        console.log("decompressed: ", msg);
        return storage.clearTraineeTest(req, res).then((msg) => {
          console.log("clear data : ", msg);
          return testunzip.makeTempsolution(req, res).then((msg) => {
            console.log("temp soln : ", msg);

            return storage.testing(req, res).then((msg) => {
              console.log("testing : ", msg);
              return storage.clearTempScript(req, res).then((msg) => {
                console.log("clear data : ", msg);
                return storage.clearTraineeScript(req, res).then((msg) => {
                  console.log("clear data : ", msg);
                  return storage.fetchMarks(req, res).then((data) => {
                    report = jsonReport.parser(data, req, res)
                    return database.addResult(req, res, report).then((empResult) => {
                      scriptCount++
                      console.log("Script: " + scriptCount + " - Evaluated " + empResult.empId);
                      next();
                    })
                  })
                })
              })
            })
          })
        })
      }).catch((err) => {
        console.log(err.message)
        next();
      })
    }, (err) => {
      if (err) {
        console.error('Error: ' + err.message);
      }
      Traineestats = true;
      console.log('Evaluation completed for - ' + scriptCount + ' scripts');
      if (scriptCount > 0) {
        res.send({ "status": "Completed" })
      } else {
        res.send("No Scripts Evaluated")
      }
    })
  }
})

module.exports = router