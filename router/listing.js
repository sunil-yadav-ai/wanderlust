const express = require('express');
const router = express.Router();
const listingControls = require("../controls/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })

const { isLogin,isOwner ,validateListing} = require("../middleware.js");





//index route All listing is here
router.route("/")
    .get( listingControls.index )
    .post(isLogin,upload.single('listing[image][url]'),listingControls.postListing);
    // .post(upload.single('listing[image][url]'),(req,res)=>{
    //     res.send(req.file);
    // })









//create new listing here

router.get('/new',isLogin,listingControls.createRender);


//edit requiest


router.get('/:id/edit',isLogin,isOwner, listingControls.editRender);

//edit here


router.route("/:id")
    .put( validateListing,upload.single('listing[image][url]'), listingControls.editListing)
    .delete(isLogin,isOwner,listingControls.deleteListing)
    .get(listingControls.showListing);





//delete here


//show 
//show router



module.exports = router;