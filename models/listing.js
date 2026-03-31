const mongoose = require('mongoose');
const review = require('./review');

const Schema = mongoose.Schema;
const listingSchema = new Schema({
    title:{
        type:String,
        
    },
    description:String,
    image:{
        filename:{
            type:String,
            
        },
        url:{
            type:String,
            
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
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({
            _id: { $in: listing.reviews }
        });
    }
});

const listing = mongoose.model('listing',listingSchema);
module.exports = listing;