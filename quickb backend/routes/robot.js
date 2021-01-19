const express = require('express')
const router = express.Router()

require("es6-promise").polyfill()
require("isomorphic-fetch")

const RECAPTCHA_SERVER_KEY = '6LcAq-MZAAAAAPSWKTgrg2yWHjHvPFTR95h4OF5Z'
router.post("/test",(req,res)=>{
    const humanKey=req.body.value
    const isHuman =  fetch(`https://www.google.com/recaptcha/api/siteverify`, {
  method: "post",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
  },
  body: `secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`
})
  .then(res => res.json())
  .then(json => json.success)
  .catch(err => {
    throw new Error(`Error in Google Siteverify API. ${err.message}`)
  })

if (humanKey === null || !isHuman) {
  throw new Error(`YOU ARE NOT A HUMAN.`)
}
res.json({message:"success"})
})



module.exports = router