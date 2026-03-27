const express = require('express');

const app = express();
const mongoose = require('mongoose');
const session = require('express-session')

const path = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError.js')
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const listingsRouter = require('./router/listing.js');
const flash = require('connect-flash');
const User = require("./models/user.js");
const userRouter = require("./router/user.js");

const reviewsRouter = require('./router/review.js');


const sessionOperations ={
    secret:"sunilyadav",
    resave:false,
    saveUninitialized:true ,
    cookie:{
        express:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true

    },
}




app.engine('ejs', ejsMate);
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,"/public")));
app.use(session(sessionOperations));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




//server

main().then(()=>{
    console.log('connection is done!');
    })
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/WanderLust');

}

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


// app.get("/Demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"abc@gmail.com",
//         username:"sunilyadav"
//     })

//     let result=  await User.register(fakeUser,"helloWord");
//     res.send(result);

// })



app.use('/listing' ,listingsRouter);
app.use('/listing/:id/review',reviewsRouter);
app.use('/',userRouter);


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