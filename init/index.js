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
    await listing.insertMany(initdata.data);
    console.log("data is store..");

}

initdb();