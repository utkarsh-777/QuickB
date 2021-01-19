const jwt = require('jsonwebtoken')
const {secret} = require('../key')
const mysql = require('mysql')
//const User = require('../models/user')
//const mongoose = require('mongoose')

var con = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "mysql1234",
    database: "QuickB"
})

exports.requireLogin= (req,res,next) => {
    const {authorization} = req.headers
    if(!authorization){
        res.status(404).json({message:'U need to login first!'})
    }
    const token = authorization.replace('Bearer ',"")
    jwt.verify(token,secret,(err,payload)=>{
        if(err){
            return res.status(401).json({error:'U must be logged in!'})
        }

        const {id} = payload
        //var rid = [id]
        con.query('select * from user where id=?',[id],function(err,res){
            //console.log(res)
            req.user = res
            next()
        })
        
    })
}

