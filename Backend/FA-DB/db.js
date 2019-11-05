const connection = require('./connection')
const connecti = require('./difconnection')
const conn = require('./tskconnection')
var evaluation = {}

evaluation.addResult = (req, res, evalObj) => {
    return connection(req, res).then((collection) => {
        return collection.create(evalObj).then((data) => {
            if (data) {
                
                return data
            }
            else {
                throw new Error("Not inserted",evalObj.empId)
            }
        })
    })
}

evaluation.resultByFA = (req,res) => {
    return connection(req, res).then((collection) => {
        return collection.find({},{_id:0,empId:1,totalMark:1}).then((data)=>{
            if(data){
                return data
            }else{
                throw new Error("No record found")
            }
        })
    })
}

evaluation.resultByTrainee = (req,res) => {
    return connection(req, res).then((collection) => {
        return collection.findOne({empId : req.body.empId},{_id:0,__v:0}).then((data)=>{
            if(data){
                return data
            }else{
                throw new Error("No record found")
            }
        })
    })
}
evaluation.allEvaluations = (req,res) => {
    return connection(req, res).then((collection) => {
        return collection.findOne({empId : req.body.empId},{_id:0,__v:0}).then((data)=>{
            if(data){
                return data
            }else{
                throw new Error("No record found")
            }
        })
    })
}
evaluation.getProj=()=>{
	return connection().then((collection)=>{
		return collection.find({},{_id:0,projId:1,projName:1}).then((data)=>{console.log(data);return data}).catch(err=>console.log(err))
	})
}
evaluation.getEmp=(id)=>{
    console.log(id)
	return connecti().then((collection)=>{
		return collection.find({},{_id:0,empid:1,empname:1,vacationleft:1}).then((data)=>{console.log(data);return data}).catch(err=>console.log(err))
	})
}
evaluation.insert=(req,res)=>{
    
	return conn().then((collection)=>{
		return collection.create(req.body).then((data)=>{console.log(data);return data}).catch(err=>console.log(err))
	})
}
evaluation.getTask=(req,res)=>{
    
	return conn().then((collection)=>{
		return collection.find({},{_id:0,empid:1,projId:1,projDate:1,blocker:1}).then((data)=>{console.log(data);return data}).catch(err=>console.log(err))
	})
}

module.exports = evaluation


