const express = require('express');
const app = express();
const mongoose = require('mongoose');
const listing = require('./models/listing.js');

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

app.get('/testing', (req,res)=>{
    let sample =  new listing({
        title:"my new villa",
        description:"by the beach",
        price:1000,
        location:"jalandhar",
        country:"india"
    })
    sample.save().then((res)=>{
        console.log(res);
    })
    
    res.send("done");
})

app.listen(8080,()=>{

    console.log("server is listening port 8080.");
})