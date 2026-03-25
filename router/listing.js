const express = require('express');
const router = express.Router();
const { listingSchema} = require('../schema.js');
const ExpressError = require('../utils/expressError.js')
const listing = require('../models/listing.js');









/*
 validate middleware for server

*/


const validateListing = (req,res,next)=>{
    let { error } = listingSchema.validate(req.body);
        
        if(error){
            throw new ExpressError(400,error);

        }else{
            next();
        }
};




//index route All listing is here
router.get('/', async (req,res,next)=>{
    try{
        
        let alllistings = await listing.find();
        
        
        res.render('index.ejs',{ alllistings });

    }catch(err){
        next(err)
    }
    

})




//show router
router.get('/:id',async(req,res,next)=>{
    try{
        let { id } = req.params;


        let item = await listing.findById(id).populate("reviews");
        if(!item){
            req.flash("error","Listing is not exist!");
            res.redirect('/listing');
        }
    
    
        res.render('./show.ejs',{item});

    }catch(err){
        next(err)
    }
    
});


//create new listing here

router.get('/new',(req,res)=>{
    
    res.render('create.ejs');
})
router.post('/',validateListing,async(req,res,next)=>{
    try{
        
        
        console.log(req.body);
        let insert = new listing(req.body.listing);

        await insert.save();
        req.flash("success","New listing is created!");
        
    
        res.redirect('/listing');

    }catch(err){
        next(err)

    }
    

})

//edit requiest


router.get('/:id/edit',async(req,res,next)=>{
    try{
        let { id } = req.params;
    let item = await listing.findById(id);
    
    
    res.render('edit.ejs',{item});

    }catch(err){
        next(err)
    }
    
})

//edit here



router.put("/:id", validateListing, async (req, res, next) => {
    try {
        let { id } = req.params;

        let { title, description, image, price, location, country } = req.body.listing;

        // Fix image format
        if (typeof image === "string") {
            image = {
                url: image,
                filename: "listingimage"
            };
        }

        let item =  await listing.findByIdAndUpdate(id, {
            $set: { title, description, image, price, location, country }
        });


        if(!item){
        req.flash("error","Listing is not exist!");
        res.redirect('/listing');
    }
        req.flash("success","listing is Edit!");

        res.redirect(`/listing/${id}`);
    } catch (err) {
        next(err);
    }
});



//delete here
router.delete('/:id',async(req,res,next)=>{
    try{
        let {id} = req.params;
    let d = await listing.findByIdAndDelete(id);
    req.flash("success","listing is Delete!");
    res.redirect('/listing');

    }catch(err){
        next(err)
    }
    

})

//show 


module.exports = router;