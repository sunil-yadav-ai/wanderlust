const express = require("express");


module.exports.isLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must login first to any action!");
        return res.redirect("/login")
    }
    next();
}

