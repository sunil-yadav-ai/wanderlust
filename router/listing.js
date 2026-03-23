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

//create new listing here

router.get('/new',(req,res)=>{
    
    res.render('create.ejs');
})
router.post('/',validateListing,async(req,res,next)=>{
    try{
        
        
        let{title,description,image,price,location,country} = req.body;
        let insert = await listing.insertOne({title,description,image,price,location,country});
    
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

router.put("/:id",validateListing,async(req,res,next)=>{
    try{
        let { id } = req.params;
        

        // if(typeof req.body.image === "string") {
        //     req.body.image = { url: req.body.image };
        // }
        
    let{title,description,image,price,location,country} = req.body;
    
    
    let update = await listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    
    
    res.redirect(`/listing/${id}`);


    }catch(err){
        next(err)
    }
    

})

router.get('/:id',async(req,res,next)=>{
    try{
        let { id } = req.params;

        




    let item = await listing.findById(id).populate("reviews");
    
    
    res.render('./show.ejs',{item});

    }catch(err){
        next(err)
    }
    
})


//delete here
router.delete('/:id',async(req,res,next)=>{
    try{
        let {id} = req.params;
    let d = await listing.findByIdAndDelete(id);
    res.redirect('/listing');

    }catch(err){
        next(err)
    }
    

})

//show 


module.exports = router;