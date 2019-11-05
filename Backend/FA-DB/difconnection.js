const mongoose = require('mongoose');
const Schema = mongoose.Schema

mongoose.Promise = global.Promise;
let createConnection1 = () => {
    mongoose.set('useCreateIndex', true);
	
    return mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true })
        .then((db) => {
		console.log('yo')
            return db.model('emp', new Schema({"empid":{type:Number},"empname":{type:String},"vacationleft":{type:Number}}),'emp');
        }).catch((error) => {
            console.log("in connections", error);
            let err = new Error('Could not connect to Database');
            err.status = 500;
            throw err;
        })
}
module.exports=createConnection1;