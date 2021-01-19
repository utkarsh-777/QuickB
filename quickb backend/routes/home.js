const express = require('express')
const router = express.Router()
const {requireLogin} = require('../middleware/requirelogin')

router.get('/user',requireLogin,(req,res)=>{
    res.json({name:req.user[0].name,username:req.user[0].username})
})

module.exports = router