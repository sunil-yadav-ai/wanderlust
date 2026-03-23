const express = require('express');
const router = express.Router({mergeParams:true});

const listing = require('../models/listing.js');
const review = require('../models/review.js');
const ExpressError = require('../utils/expressError.js');
const { reviewSchema} = require('../schema.js')




/*
review validate middleware for server 

*/
const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);

    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}



//review post here

router.post('/',validateReview,async(req,res,next)=>{
    try{
        let { id} = req.params;
    

        let data = await listing.findById(id);
        let review1 = new review(req.body.review);
        
        
        data.reviews.push(review1);
        await review1.save();
        await data.save();
        
        res.redirect(`/listing/${id}`);
    }catch(err){
        
        throw new ExpressError(404,err);
    }
    
})

//review delete route
router.delete("/:reviewId", async (req, res) => {
    try {
        let { id, reviewId } = req.params;

       
        let result = await listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});

        
        let reviewresult = await review.findByIdAndDelete(reviewId);
        console.log(result);
        console.log(reviewresult);

        res.redirect(`/listing/${id}`);
    } catch (err) {
        throw new ExpressError(404, err);
    }
});

module.exports = router;