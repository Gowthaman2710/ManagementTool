const mongoose = require('mongoose');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise;

let createConnection = () => {
    mongoose.set('useCreateIndex', true);
	
    return mongoose.connect('mongodb://localhost:27017/test' , { useNewUrlParser: true })
        .then((db) => {
			
            return db.model('log', new Schema({"empid":{type:Number},"projId":{type:Number},"blocker":{type:String},"projDate":{type:Date}}), 'log');
        }).catch((error) => {
            console.log("in connections", error.message);
            let err = new Error('Could not connect to Database');
            err.status = 500;
            throw err;
        })


}
module.exports=createConnection