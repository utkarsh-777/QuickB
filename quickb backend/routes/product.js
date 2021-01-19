const express = require('express')
const router = express.Router()
const {requireLogin} = require('../middleware/requirelogin')
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql')

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

router.post('/addproduct',requireLogin,(req,res)=>{
    if(!req.body.pname && !req.body.price &&!req.body.quantity)
    {
        return res.json({error:'Enter atleast the Name Price and Quantity of the Product!'})
    }
    const values = [[uuidv4(),req.user[0].username,req.body.pname,req.body.price,req.body.description,req.body.quantity]]

    var check = 'select * from product where pname=? and user=?'
    con.query(check,[req.body.pname,req.user[0].username],function(err,result){
         if(result.length>0){
             return res.json({error:`${req.body.pname} already in Basket!`})
         }
         else{
            const sql = 'insert into product values ?'
            con.query(sql,[values],function(err,result){
                if(err) throw err
                return res.json({message:`${req.body.pname} added Successfully!`})
            })
         }
    })
})

router.put('/editproduct',requireLogin,(req,res)=>{
    var query = 'select * from product where pid=?'
    var arr = []
    var q1 = 'update product set pname=?,price=?,description=?,quantity=? where pid=?'
    con.query(query,[req.body.pid],function(err,result){
        if(err) throw err;
        if(req.body.pname){
            arr.push(req.body.pname)
        }else{
            arr.push(result[0].pname)
        }

        if(req.body.price){
            arr.push(req.body.price)
        }else{
            arr.push(result[0].price)
        }

        if(req.body.description){
            console.log(req.body.description)
            arr.push(req.body.description)
        }else{
            arr.push(result[0].description)
        }

        if(req.body.quantity){
            arr.push(req.body.quantity)
        }else{
            arr.push(result[0].quantity)
        }
        con.query(q1,[arr[0],arr[1],arr[2],arr[3],req.body.pid],function(err,result){
            if(err) throw err;
            res.json(result)
        })
    })  
})

router.delete('/deleteproduct',requireLogin,(req,res)=>{
    var vals=[req.body.pid,req.user[0].username]
    var query = 'delete from product where pid=? and user=?'
    con.query(query,vals,function(err,result){
        if(err) throw err;
        if(result.affectedRows==0){
            return res.json({error:"Not in Basket!"})
        }else{
            return res.json({message:"succesfully deleted!"})
        }
    })
})
    
router.get('/products',requireLogin,(req,res)=>{
    var sql = 'select * from product where user=?'
    const user = [[req.user[0].username]]
    con.query(sql,[user],function(err,result){
        if(err) throw err;
        return res.json(result)
    })
})



module.exports = router