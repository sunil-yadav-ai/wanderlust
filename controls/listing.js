const listing = require('../models/listing.js');



module.exports.index = async (req,res,next)=>{
    try{
        
        
        let alllistings = await listing.find();
        
        
        res.render('index.ejs',{ alllistings });

    }catch(err){
        next(err)
    }
    

}



module.exports.createRender = (req,res)=>{
    
    res.render('create.ejs');
}



module.exports.postListing = async(req,res,next)=>{
    try{
        
        
       let { link , filename } =  req.file;
        let insert = new listing(req.body.listing);
        insert.owner = req.user._id;
        insert.image.url = link;
        insert.image.filename = filename;


        await insert.save();
        console.log(insert);
        req.flash("success","New listing is created!");
        
    
        res.redirect('/listing');

    }catch(err){
        next(err)

    }
    

}




module.exports.editRender = async(req,res,next)=>{
    try{
        
        let { id } = req.params;
    let item = await listing.findById(id);
        if(!item){
            req.flash("error","Listing does not exist!");
            return res.redirect('/listing');
        }  
    
    
    res.render('edit.ejs',{item});

    }catch(err){
        next(err)
    }
    
}



module.exports.editListing = async (req, res, next) => {
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


         



        req.flash("success","listing is Edit!");

        res.redirect(`/listing/${id}`);
    } catch (err) {
        next(err);
    }
}





module.exports.deleteListing = async(req,res,next)=>{
    try{
        let {id} = req.params;
    let d = await listing.findByIdAndDelete(id);
    req.flash("success","listing is Delete!");
    res.redirect('/listing');

    }catch(err){
        next(err)
    }
    

}



module.exports.showListing = async(req,res,next)=>{
    try{
        let { id } = req.params;


        let item = await listing.findById(id).populate({path: "reviews",populate: {path: "author"}}).populate("owner");
        if(!item){
            req.flash("error","Listing is not exist!");
           return  res.redirect('/listing');
        }
        
    
    
        res.render('./show.ejs',{item});

    }catch(err){
        next(err)
    }
    
}