const router = require('express').Router();
const verify = require('./verifytoken');
const user = require('../models/user');

router.get('/',verify,(req,res)=>{

 res.send(req.user);
 
 // res.send(User.findOne({_id:req.user}));   use this in auth.js
});


module.exports = router