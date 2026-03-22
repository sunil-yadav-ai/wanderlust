const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError.js')
const ejsMate = require("ejs-mate");

const { listingSchema} = require('./schema.js');
const review = require('./models/review.js');
const { reviewSchema } = require('./schema.js')




app.engine('ejs', ejsMate);
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"/public")));


//server

main().then(()=>{
    console.log('connection is done!');
    })
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

}


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

// get requiest for root

app.get('/',(req,res)=>{
    res.send('i am root');
})


//index route All listing is here
app.get('/listing', async (req,res,next)=>{
    try{
        
        let alllistings = await listing.find();
        
        res.render('index.ejs',{ alllistings });

    }catch(err){
        next(err)
    }
    

})

//create new listing here

app.get('/listing/new',(req,res)=>{
    
    res.render('create.ejs');
})
app.post('/listing',validateListing,async(req,res,next)=>{
    try{
        
        
        let{title,description,image,price,location,country} = req.body;
        let insert = await listing.insertOne({title,description,image,price,location,country});
    
        res.redirect('/listing');

    }catch(err){
        next(err)

    }
    

})

//edit requiest


app.get('/listing/:id/edit',async(req,res,next)=>{
    try{
        let { id } = req.params;
    let item = await listing.findById(id);
    res.render('edit.ejs',{item});

    }catch(err){
        next(err)
    }
    
})

//edit here

app.put("/listing/:id",validateListing,async(req,res,next)=>{
    try{
        let { id } = req.params;
        
    let{title,description,image,price,location,country} = req.body;
    let update = await listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    res.redirect(`/listing/${id}`);


    }catch(err){
        next(err)
    }
    

})

//delete here
app.delete('/listing/:id',async(req,res,next)=>{
    try{
        let {id} = req.params;
    let d = await listing.findByIdAndDelete(id);
    res.redirect('/listing');

    }catch(err){
        next(err)
    }
    

})

//show 

app.get('/listing/:id',async(req,res,next)=>{
    try{
        let { id } = req.params;
    let item = await listing.findById(id).populate("reviews");
    
    res.render('show.ejs',{item});

    }catch(err){
        next(err)
    }
    
})

//review post here

app.post('/listing/:id/review',validateReview,async(req,res,next)=>{
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
app.delete("/listing/:id/review/:reviewId", async (req, res) => {
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


// app.get('/testing', (req,res)=>{
//     let sample =  new listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1000,
//         location:"jalandhar",
//         country:"india"
//     })
//     sample.save().then((res)=>{
//         console.log(res);
//     })
    
//     res.send("done");
// })


//if user enter wrong path then execute this
app.use((req,res,next)=>{
    next( new ExpressError(404,"page not found!!"));
    
});

app.use((err,req,res,next)=>{
    let { statusEx=500,message="Somthing went worng"} = err;
    res.status(statusEx).render("error.ejs" , { message });
    
})

//port number
app.listen(8080,()=>{

    console.log("server is listening port 8080.");
})