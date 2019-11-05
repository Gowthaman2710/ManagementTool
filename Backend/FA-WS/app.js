const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const resultRouter = require("./routes/dbRoute")
const router = require("./routes/routing");
const errorLogger = require("./service/ErrorLogger");
const requestLogger = require("./service/RequestLogger")
const app = express();

app.use(cors());

app.use(bodyparser.json());

app.use(requestLogger)

app.use("/result",(req,res,next)=>{
    console.log(req.url);
    next()
    
},resultRouter )
app.use("/api", router);
app.use(errorLogger)

app.listen(2018);
console.log("Server Started at port 2018!")




