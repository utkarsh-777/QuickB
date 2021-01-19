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

// con.connect(function(err){
//     if(err){
//         console.log(err)
//     }
// })

router.post("/generatebill",requireLogin,(req,res)=>{
    
    if(!req.body.cname && !req.body.mobile && req.body.address && !req.body.iname && !req.body.iquantity){
        return res.json({error:'Enter all the fields'})
    }else{
        checkcust = 'select mobile from customer where mobile=? and user=?;'

        con.query(checkcust,[req.body.mobile,req.user.username],function(err,result){
            if(err) throw err;
            if(result.length>0){
                console.log({message:'Phone number is already present!'})
            }else{
                qcust =  'insert into customer values ?'
                var values =[[uuidv4(),req.body.cname,parseInt(req.body.mobile),req.body.address,req.user[0].username]]
                con.query(qcust,[values],function(err,result){
                    if(err) throw err;
                    console.log(result)
                })
            }
    var items = req.body.iname.split(" ")
    var quan = req.body.iquantity.split(" ")
    const tid = uuidv4()
    var qq = 'select cid from customer where mobile=?'
    con.query(qq,[req.body.mobile],function(err,result){
        if(err) throw err;
        var newq = 'insert into items values ?'
        for(var n=0;n<items.length;n++){
            var values = [[uuidv4(),result[0].cid,items[n],quan[n],tid]]
            con.query(newq,[values],function(err,res){
                if(err) throw err;
            })
        }
        
        var itemquery = 'select cid,iname,iquantity from items where tid=?'
        con.query(itemquery,[tid],function(err,resu){

            if(err)throw err;
            var amount=0;
            var i=0;
            var desc = ''
            for(var m=0;m<resu.length;m++){
                var qq='select price,quantity from product where pname=?'
                let m1=resu[m]
                con.query(qq,[resu[m].iname],function(err,response){
                    if(err)throw err;
                    desc = desc + m1.iname + " "+"X"+" "+String(m1.iquantity)+","
                    if(response[0].quantity > m1.iquantity)
                    {
                       amount=amount+m1.iquantity*response[0].price
                       var up_q=response[0].quantity-m1.iquantity
                       var qq1='update product set quantity=? where pname=?'
                       con.query(qq1,[up_q,m1.iname],function(err,ress){
                           if(err)throw err;
                       })
                    }
                    else{
                        return res.json({error:"sorry insufficient quantity"})
                    }
                if(i==resu.length-1 && amount>0)
                {
                 var qp='insert into bill values ?'
                 const id = uuidv4()
                 var today = new Date();
                 var dd = String(today.getDate()).padStart(2, '0');
                 var mm = String(today.getMonth() + 1).padStart(2, '0');
                 var yyyy = today.getFullYear();
                 today = yyyy + '/' + mm + '/' + dd;
                 var newvalues = [[id,m1.cid,amount,desc,today]]
                 con.query(qp,[newvalues],function(err,resp){
                     if(err)throw err;
                     console.log(resp)
                 })

                 var rbill = "select * from bill where bid=?"
                 con.query(rbill,[id],function(err,resp){
                     if(err) throw err;
                     res.json({bill:resp})
                 })
                }
                i=i+1
                })
            }
        })
    })
        })
    
    }
})

router.get("/getbill",requireLogin,(req,res)=>{
    con.query("select cname,mobile,address,b.* from customer c,bill b where c.user=? and c.cid=b.cid order by date desc",[req.user[0].username],function(err,result){
        if(err) throw err;
        return res.json(result)
    })
})

router.post("/customerbills",requireLogin,(req,res)=>{
    if(req.body.cname.length>0){
        con.query("select cname,mobile,address,b.* from customer c,bill b where c.cname like ? and c.cid=b.cid and c.user=? order by b.date desc",[req.body.cname+'%',req.user[0].username],function(err,result){
            if(err) throw err;
            console.log(result)
            return res.json(result)
        })
    }else{
        console.log('yay')
        return res.json({error:'nothing!'})
    }
})

router.post("/billbydate",requireLogin,(req,res)=>{
    con.query("select cname,mobile,address,bill_amount,description,date from bill b,customer c where b.cid=c.cid and b.date between ? and ? and c.user=?",[req.body.startdate,req.body.enddate,req.user[0].username],function(err,result){
        if(err) throw err;
        return res.json(result)
    })
})

// router.get("/getbills",requireLogin,(req,res)=>{
//     var cq = 'select cid,cname,mobile from customer where user=?'
//     con.query(cq,[req.user[0].username],function(err,result){
//         if(err) throw err;
//         let arr = []
//         var mm = 0
//         var q = 'select * from bill where cid=?'
//         for(var i=0;i<result.length;i++){
//             var m = result[i].cname
//             var n = result[i].mobile
//             con.query(q,[result[i].cid],function(err,resu){
//             if(err) throw err;
//             arr.push({cname:m,mobile:n,bills:resu})
//             mm = mm + 1
//             if(mm==result.length){
//                 console.log(arr)
//                 res.json(arr)
//             }
//             }) 
//         }
//     })
// })

router.get('/customers',requireLogin,(req,res)=>{
    var q = 'select * from customer where user=?'
    con.query(q,[req.user[0].username],function(err,result){
        if(err) throw err;
        res.json(result)
    })
})

router.post('/billcustomer',requireLogin,(req,res)=>{
    var q = "select distinct cname,mobile,address from customer c,bill b where c.cid=(select cid from bill where bid=?) and c.cid=b.cid and c.user=?"
    con.query(q,[req.body.bid,req.user[0].username],function(err,result){
        if(err) throw err;
        console.log(result)
        return res.json(result)
    })
})


router.post('/customer',requireLogin,(req,res)=>{
    var q = 'select * from customer where cid=?'
    con.query(q,[req.body.cid],function(err,result){
        if(err) throw err;
        return res.json(result)
    })
})

module.exports = router;