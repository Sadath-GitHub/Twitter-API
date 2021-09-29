const router = require("express").Router();
const { compile } = require("morgan");
const express = require('express');
const app = express();
const User = require('../models/User')
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(session({
        resave:true,
        saveUninitialized:true,
        secret:"secret",
        // store:store,
    }));


//register
router.post("/register",async (req,res)=>{
    const newUSer = new User({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    });
    if(newUser = await User.findOne({email:req.body.email})){
        res.status(404).json("user already exists. Try to login");
    }
    else{
    try{
        const user = await newUSer.save();
        res.status(200).json(user)
    }catch(err){
        console.log(err);
    }
}
});


// login
router.post("/login",async (req,res)=>{
    try{
    const user = await User.findOne({email:req.body.email});
    !user && res.status(404).json("user not found");
    const validPassword = await req.body.password==user.password;
    !validPassword && res.status(400).json("wrong password");
    // const sessionuser={
    //     sessionuseremail: req.body.email,
    //     sessionuserpassword:req.body.password,
    // }
    // req.session.sessionuser = user;
    req.session.save();
    res.status(200).json(user);
    }catch(err){
        console.log(err);
    }
})

// router.get("/user",(req,res)=>{
//     return res.send(req.session.ser)
// })
// console.log(session);
// console.log(cookieParser);




module.exports = router;