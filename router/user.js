const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/signUp",(req,res)=>{
    res.render("./user/signUp.ejs");
})

router.post("/signUp",async (req,res)=>{
    try{
        let { username,email,password} = req.body;

        let result =  new User({username,email});
        let reg = await User.register(result,password);
        console.log(reg);
        req.flash("success","Welcome to WanderLust.");
        res.redirect('/listing');
    }catch(e){
        req.flash("error",e.message);
        res.redirect("signUp");
    }
    
})




router.get("/login",(req,res)=>{
    res.render("./user/login.ejs")
})

router.post("/login",
    passport.authenticate('local', 
        { failureRedirect: '/login',
            failureFlash:"You account is not signUp" 
        }),
    async(req,res)=>{
        req.flash("success","Welcome back on WanderLust");
        res.redirect("/listing");
})

module.exports = router;