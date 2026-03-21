const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        
    },
    description:String,
    image:{
        filename:{
            type:String
        },
        url:{
            type:String,
            default:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGxha2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        }
        
       
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"review"
        }
    ]
})

const listing = mongoose.model('listing',listingSchema);
module.exports = listing;