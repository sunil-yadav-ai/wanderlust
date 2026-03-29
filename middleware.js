const express = require("express");
const listing = require("./models/listing");
const review = require("./models/review");

const ExpressError = require('./utils/expressError.js');
const { listingSchema,reviewSchema} = require('./schema.js');




/*
review validate middleware for server 

*/
module.exports.validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}













/*
 validate middleware for server

*/


module.exports.validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
        
        if(error){
            throw new ExpressError(400,error);

        }else{
            next();
        }
};








module.exports.isLogin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must login first to any action!");
        return res.redirect("/login")
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let item = await listing.findById({_id:id});

     if (!item.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listing/${id}`);
    }

    
    next();
}




module.exports.isReviewOwner = async (req,res,next)=>{
    let { id ,reviewId} = req.params;
    let item = await review.findById({_id:reviewId});

     if (!item.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this Review!");
        return res.redirect(`/listing/${id}`);
    }

    
    next();
}
