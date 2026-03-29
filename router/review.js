const express = require('express');
const router = express.Router({mergeParams:true});

const listing = require('../models/listing.js');
const review = require('../models/review.js');
const ExpressError = require('../utils/expressError.js');

const { validateReview,isLogin,isReviewOwner} = require("../middleware.js");







//review post here

router.post('/',validateReview,isLogin,async(req,res,next)=>{
    try{
        let { id} = req.params;
    

        let data = await listing.findById(id);
        let review1 = new review(req.body.review);
       
        
        
        data.reviews.push(review1);
         review1.author = req.user._id;
        await review1.save();
        await data.save();
        req.flash("success","Review is Post!");
        
        res.redirect(`/listing/${id}`);
    }catch(err){
        
        throw new ExpressError(404,err);
    }
    
})

//review delete route
router.delete("/:reviewId",isLogin,isReviewOwner, async (req, res) => {
    try {
        let { id, reviewId } = req.params;

       
        let result = await listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});

        
        let reviewresult = await review.findByIdAndDelete(reviewId);
        console.log(result);
        console.log(reviewresult);
        req.flash("success","Review is Delete!");

        res.redirect(`/listing/${id}`);
    } catch (err) {
        throw new ExpressError(404, err);
    }
});

module.exports = router;