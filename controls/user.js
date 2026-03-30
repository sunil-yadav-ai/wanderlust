const User = require("../models/user");


module.exports.signUPRender = (req,res)=>{
    res.render("./user/signUp.ejs");
}


module.exports.signUPPost = async (req,res,next)=>{
    try{
        let { username,email,password} = req.body;

        let result =  new User({username,email});
        let reg = await User.register(result,password);
        req.login(reg,(error)=>{
            if(error){
                return next(error);
            }
            req.flash("success","Welcome to WanderLust.");
            res.redirect('/listing');
        })
        
        
    }catch(e){
        req.flash("error",e.message);
        res.redirect("signUp");
    }
    
}


module.exports.loginRender = (req,res)=>{
    res.render("./user/login.ejs")
}

module.exports.loginPost = async(req,res)=>{
        req.flash("success","Welcome back on WanderLust");
        res.redirect("/listing");
}


module.exports.logOutUser = (req,res,next)=>{
    req.logOut((error)=>{
        if(error){
            return next(error);
        }
        req.flash("success","you are logout!");
        res.redirect("/listing");

    })
}