const mongoose = require('mongoose');
const listing = require('../models/listing.js');
const initdata = require('./data.js');

main().then(()=>{
    console.log('connection is done!');
    })
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

}

const initdb = async ()=>{
    await listing.deleteMany({});
   initdata.data =  initdata.data.map((obj)=>({...obj,owner:"69c77a9cdfd153a0b17f6c44"}));
    await listing.insertMany(initdata.data);
    console.log("data is store..");

}

initdb();