const express = require('express');
const router = express.Router({mergeParams:true});




const reviewControls = require("../controls/review.js");
const { validateReview,isLogin,isReviewOwner} = require("../middleware.js");







//review post here

router.post('/',validateReview,isLogin,reviewControls.postReview);

//review delete route
router.delete("/:reviewId",isLogin,isReviewOwner,reviewControls.deleteReview );

module.exports = router;