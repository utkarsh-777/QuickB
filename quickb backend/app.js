const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const PORT = 5000

const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const productRoutes = require('./routes/product')
const customerRoutes = require('./routes/customer')
const testRoutes = require('./routes/robot')

app.get('/',(req,res)=>{
    res.send("Server Running")
})

var con = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "mysql1234",
    database: "QuickB"
})

con.connect(function(err){
    if(err){
        console.log(err)
    }else{
        console.log('CONNETED TO DB')
    }
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors())
app.use("/api",authRoutes)
app.use("/api",homeRoutes)
app.use("/api",productRoutes)
app.use("/api",customerRoutes)
app.use("/api",testRoutes)

app.listen(PORT,()=>{
    console.log(`App running at port ${PORT}`)
})