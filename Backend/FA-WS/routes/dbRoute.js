var express = require("express")
var router = express.Router()
var db = require("../../FA-DB/db")

router.post("/resultByFA", (req, res, next) => {
    console.log("inside db route");
    db.resultByFA(req, res, next).then((result) => {
        console.log('result',result)
        res.json(result)
    }).catch((err) => {
        next(err)
    })
})

router.post("/resultByTrainee", (req, res, next) => {
    console.log("inside db route",req.body);
    db.resultByTrainee(req, res, next).then((result) => {
        res.json(result)
    }).catch((err) => {
        next(err)
    })
})
router.get('/getProj',(req, res, next)=>{
	console.log(req.body)
	db.getProj().then(r=>{res.json(r)})
	
})
router.post('/getEmp',(req, res, next)=>{
	console.log(req.body,'bpdy')
	db.getEmp(req.body.id).then(r=>{res.json(r)})
	
})
router.post('/insert',(req, res, next)=>{
	console.log(req.body,'bpdy')
	db.insert(req,res).then(r=>{res.json(r)})
	
})
router.get('/getTask',(req, res, next)=>{
	console.log(req.body,'bpdy')
	db.getTask(req,res).then(r=>{res.json(r)})
	
})

router.get("*",(req,res,next)=>{
    console.log("Path not found!")
})


module.exports = router