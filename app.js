const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError.js')
const ejsMate = require("ejs-mate");




app.engine('ejs', ejsMate);
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log('connection is done!');
    })
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

}

app.get('/',(req,res)=>{
    res.send('i am root');
})


//index route
app.get('/listing',async (req,res,next)=>{
    try{
        let alllistings = await listing.find();
    res.render('index.ejs',{ alllistings });

    }catch(err){
        next(err)
    }
    

})

app.get('/listing/new',(req,res)=>{
    
    res.render('create.ejs');
})
app.post('/listing',async(req,res,next)=>{
    try{
        if(!req.body){
            throw new ExpressError(400,"Send valid data for listing")
        }
        let{title,description,image,price,location,country} = req.body;
        let insert = await listing.insertOne({title,description,image,price,location,country});
    
        res.redirect('/listing');

    }catch(err){
        next(err)

    }
    

})

app.get('/listing/:id/edit',async(req,res,next)=>{
    try{
        let { id } = req.params;
    let item = await listing.findById(id);
    res.render('edit.ejs',{item});

    }catch(err){
        next(err)
    }
    
})

app.put("/listing/:id",async(req,res,next)=>{
    try{
        let { id } = req.params;
        if(!req.body){
            throw new ExpressError(400,"Send valid ID")
        }
    let{title,description,image,price,location,country} = req.body;
    let update = await listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    res.redirect(`/listing/${id}`);


    }catch(err){
        next(err)
    }
    

})
app.delete('/listing/:id',async(req,res,next)=>{
    try{
        let {id} = req.params;
    let d = await listing.findByIdAndDelete(id);
    res.redirect('/listing');

    }catch(err){
        next(err)
    }
    

})


app.get('/listing/:id',async(req,res,next)=>{
    try{
        let { id } = req.params;
    let item = await listing.findById(id);
    console.log(item);
    res.render('show.ejs',{item});

    }catch(err){
        next(err)
    }
    
})




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

app.use((req,res,next)=>{
    next(new ExpressError( 404, "page not found!"))
});

app.use((err,req,res,next)=>{
    let { statusEx=500,message="Somthing went worng"} = err;
    res.status(statusEx).send(message);
    
})

app.listen(8080,()=>{

    console.log("server is listening port 8080.");
})