const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const newContributorsRoute = require('./routes/newContributors')



//Grabbing port
const port = process.env.PORT || 8800
//Grabbing the enviroment variables
dotenv.config()

//Connecting with mongodb
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>console.log("DB Connection Successful")).catch((err)=>console.log(err))


//Express using json format for files
app.use(express.json());


////////////////////////Router Paths///////////////////////////////////

//Path for auth router file
app.use("/api/newContributors", newContributorsRoute);



app.listen(port,()=>{
    console.log(`Server up at ` + port)
})