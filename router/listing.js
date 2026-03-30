const express = require('express');
const router = express.Router();
const listingControls = require("../controls/listing.js");



const { isLogin,isOwner ,validateListing} = require("../middleware.js");





//index route All listing is here
router.route("/")
    .get( listingControls.index )
    .post(validateListing,listingControls.postListing);









//create new listing here

router.get('/new',isLogin,listingControls.createRender);


//edit requiest


router.get('/:id/edit',isLogin,isOwner, listingControls.editRender);

//edit here


router.route("/:id")
    .put( validateListing, listingControls.editListing)
    .delete(isLogin,isOwner,listingControls.deleteListing)
    .get(listingControls.showListing);





//delete here


//show 
//show router



module.exports = router;