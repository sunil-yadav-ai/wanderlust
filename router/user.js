const express = require('express');
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");



//signe router 

router.get("/signUp",(req,res)=>{
    res.render("./user/signUp.ejs");
})



router.post("/signUp",async (req,res,next)=>{
    try{
        let { username,email,password} = req.body;

        let result =  new User({username,email});
        let reg = await User.register(result,password);
        req.login(reg,(error)=>{
            if(error){
                return next(error);
            }
            req.flash("success","Welcome to WanderLust.");
            res.redirect('/listing');
        })
        
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("signUp");
    }
    
})


//login router

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


//logout router

router.get("/logout",(req,res,next)=>{
    req.logOut((error)=>{
        if(error){
            return next(error);
        }
        req.flash("success","you are logout!");
        res.redirect("/listing");

    })
})

module.exports = router;