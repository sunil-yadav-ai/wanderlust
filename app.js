const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override')

 
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

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
app.get('/listing',async (req,res)=>{
    let alllistings = await listing.find();
    res.render('index.ejs',{ alllistings });

})

app.get('/listing/new',(req,res)=>{
    
    res.render('create.ejs');
})
app.post('/listing',async(req,res)=>{
    let{title,description,image,price,location,country} = req.body;
    let insert = await listing.insertOne({title,description,image,price,location,country});
    
    res.redirect('/listing');

})

app.get('/listing/:id/edit',async(req,res)=>{
    let { id } = req.params;
    let item = await listing.findById(id);
    res.render('edit.ejs',{item});
})

app.put("/listing/:id",async(req,res)=>{
    let { id } = req.params;
    let{title,description,image,price,location,country} = req.body;
    let update = await listing.findByIdAndUpdate(id,{title,description,image,price,location,country});
    res.redirect(`/listing/${id}`);


})
app.delete('/listing/:id',async(req,res)=>{
    let {id} = req.params;
    let d = await listing.findByIdAndDelete(id);
    res.redirect('/listing');

})


app.get('/listing/:id',async(req,res)=>{
    let { id } = req.params;
    let item = await listing.findById(id);
    res.render('show.ejs',{item});
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

app.listen(8080,()=>{

    console.log("server is listening port 8080.");
})