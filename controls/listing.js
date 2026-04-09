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



// module.exports.postListing = async(req,res,next)=>{
//     try{

//         let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.listing.location)}&format=json`;

//         let result = await fetch(url, {
//             headers: {
//                 "User-Agent": "simple-app"
//             }
//         });

//         let data = await result.json();

//         // console.log(data[0].lat, data[0].lon);
        
        

        
  
//        let { path , filename } =  req.file;
//         //    console.log(path);
//         //    console.log(filename);
//         let insert = new listing(req.body.listing);
//         insert.owner = req.user._id;
//         insert.image.url = path;
//         insert.image.filename = filename;

//         insert.coordinates.lat = data[0].lat;
//         insert.coordinates.lon = data[0].lon;
//         let print = await insert.save();
//         console.log(print);
//         // console.log(insert);
//         req.flash("success","New listing is created!");
        
    
//         res.redirect('/listing');

//     }catch(err){
//         next(err)
//     }

// }














module.exports.postListing = async (req, res, next) => {
    try {

        let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(req.body.listing.location)}&format=json`;

        

        let result = await fetch(url, {
        headers: {
            "User-Agent": "simple-app"
        }
        });

        let text = await result.text();

        let data;

        try {
        data = JSON.parse(text);
        } catch (err) {
        console.log("API ERROR 👉", text);
        req.flash("error", "Location not found or API blocked!");
        return res.redirect("/listing/new");
        }






















        // ✅ Location check
        if (!data || data.length === 0) {
            req.flash("error", "Invalid location!");
            return res.redirect("/listing/new");
        }

        let insert = new listing(req.body.listing);
        insert.owner = req.user._id;

        // ✅ Image check
        if (req.file) {
            let { path, filename } = req.file;
            insert.image.url = path;
            insert.image.filename = filename;
        }

        // ✅ Coordinates set
        insert.coordinates.lat = data[0].lat;
        insert.coordinates.lon = data[0].lon;

        let print = await insert.save();
        console.log(print);

        req.flash("success", "New listing is created!");
        res.redirect('/listing');

    } catch (err) {
        next(err);
    }
};














    






module.exports.editRender = async(req,res,next)=>{
    try{
        
        let { id } = req.params;
        let item = await listing.findById(id);
        if(!item){
            req.flash("error","Listing does not exist!");
            return res.redirect('/listing');
        }  

    
        let origin = item.image.url;
        origin = origin.replace("/upload/","/upload/w_300,h_200,c_fill,q_auto,f_auto/");
        res.render('edit.ejs',{item , origin });

    }catch(err){
        next(err)
    }
    
}



module.exports.editListing = async (req, res, next) => {
    try {
        let { id } = req.params;
        

        let { title, description, price, location, country } = req.body.listing;

        // // Fix image format
        // if (typeof image === "string") {
        //     image = {
        //         url: image,
        //         filename: "listingimage"
        //     };
        // }

        let item =  await listing.findByIdAndUpdate(id, {
            $set: { title, description, price, location, country }
        });

        if (req.file) {
            let { path, filename } = req.file;
            item.image.url = path;
            item.image.filename = filename;

            await item.save();
        }

         



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