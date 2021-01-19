const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jsonwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const sendgridtransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const key = require('../key')

var con = mysql.createConnection({
    host: "localhost",  
    user: "root",  
    password: "mysql1234",
    database: "QuickB"
})

con.connect(function(err){
    if(err){
        console.log(err)
    }
})

const transporter = nodemailer.createTransport(sendgridtransport({
    auth:{
        api_key:'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' 
    }
}))

router.post('/signup',(req,res)=>{
    if(!req.body.username || !req.body.password || !req.body.name){
        return res.json({error:'Enter All The fields!'})
    }
    var checkuser = `select username from user where username=?;`
    var check = [[req.body.username]]
    var m = con.query(checkuser,[check])
    console.log(m)
    var sql = `insert into user values ?`
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err) throw err;
            var values = [[uuidv4(),req.body.name,req.body.username,hash,req.body.email,null,null]];
            con.query(sql,[values],function(err,result){
            if(err){
                return res.json({error:"Username already exists!"})
            }else{
                crypto.randomBytes(32,(err,buffer)=>{
                    if(err){
                        return console.log(err)
                    }
                    const token = buffer.toString("hex")
                    con.query('select * from user where email=?',[req.body.email],function(err,ress){
                        if(err) throw err;
                        if(ress.length>0){
                            con.query('update user set resetToken=?,expireToken=? where email=?',[token,Date.now() + 3600000,req.body.email],function(err,resu){
                                if(err) throw err;
                                transporter.sendMail({
                                    to:req.body.email,
                                    from:'utkarshn.18.becs@acharya.ac.in',
                                    subject:"QuickB - QuickB Account Activation",
                                    html:`
                                    <h1>QuickB activation for ${req.body.email}</h1>
                                    <h4>To activate your QuickB account follow this <a href="http://localhost:3000/activate/${token}">link</a></h4>
                                    `
                                }).then(data=>
                                    res.json({
                                    data,
                                    message:'Check your Mail!',
                                    token:token
                                }))
                            })
                        }else{
                            return res.json({error:"This email is not registered!"})
                        }
                    })
                })
                //return res.json({error:"This email is not registered!"})
                //return res.json(result)
            }
        })
    });
}); 
})

router.post('/resendEmail',(req,res)=>{
    const token = req.body.token
    transporter.sendMail({
        to:req.body.email,
        from:'utkarshn.18.becs@acharya.ac.in',
        subject:"Big Bank - Big Bank Account Activation",
        html:`
        <h1>Bank activate for ${req.body.email}</h1>
        <h4>To activate your Big Bank account follow this <a href="http://localhost:3000/activate/${token}">link</a></h4>
        `
    }).then(data=>
        res.json({
        data,
        message:'Check your Mail!',
        token:token
    }))
})

router.post('/login',(req,res)=>{
    if(!req.body.username || !req.body.password){
        return res.json({error:'Enter All The fields!'})
    }
    var values = [[req.body.username,req.body.password]]
    
    mm="SELECT * FROM user WHERE username = ?"
    con.query(mm,[req.body.username],function(err,result){
        if(err)throw err;
        if(result.length==0){
            return res.json({error:'Username and Password do not match!'})
        }else{
            const hash = result[0].password
            bcrypt.compare(req.body.password,hash)
                .then(success=>{
                    if(success){
                        const payload = {
                            id: result[0].id,
                            name: result[0].name,
                            username: result[0].username
                        }
                        jsonwt.sign(
                            payload,
                            key.secret,
                            (err,token)=>{
                                if(err) throw err;
                                return res.json({
                                    success:true,
                                    token:'Bearer '+token
                                })
                            }
                        )
                        //res.json({message:"Access Granted!"})
                    }else{
                        res.json({error:"Email And Password do not match!"})
                    }
                })
            }
        })
    })

module.exports = router


