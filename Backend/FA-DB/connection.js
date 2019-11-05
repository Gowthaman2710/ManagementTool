const mongoose = require('mongoose');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

const reportSchema = new Schema({
    "testId": { type: String},
    "testCaseName": { type: String },
    "marks": { type: Number }
})
const evaluationSchema = new Schema({
    "empId": { type: Number, unique: true },
    "totalMark": { type: Number, default: 0 },
    "questionPaper": { type: String },
    "module": [reportSchema],
    "evaluatedOn": { type: Date, default: new Date() },
    "updatedOn": { type: Date, default: new Date() }
}, { timestamps: true })

let createConnection = (req, res) => {
    mongoose.set('useCreateIndex', true);
	
    return mongoose.connect('mongodb://localhost:27017/' + req.body.batchName, { useNewUrlParser: true })
        .then((db) => {
			
            return db.model(req.body.FA, evaluationSchema, req.body.FA);
        }).catch((error) => {
            console.log("in connections", error.message);
            let err = new Error('Could not connect to Database');
            err.status = 500;
            throw err;
        })
}

let createConnection1 = () => {
    mongoose.set('useCreateIndex', true);
	
    return mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
        .then((db) => {
		
            return db.model('mgmt', new Schema({"projId":{type:Number},"projName":{type:String}}),'mgmt');
        }).catch((error) => {
            console.log("in connections", error.message);
            let err = new Error('Could not connect to Database');
            err.status = 500;
            throw err;
        })
}


module.exports = createConnection1;