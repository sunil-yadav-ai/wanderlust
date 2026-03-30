const express = require('express');
const router = express.Router();

const passport = require("passport");
const userControls = require("../controls/user");



//signe router 
router
    .route("/signUp")
    .get(userControls.signUPRender)
    .post(userControls.signUPPost);


//login router
router.route("/login")
    .get(userControls.loginRender)
    .post(
    passport.authenticate('local', 
        { failureRedirect: '/login',
            failureFlash:"You account is not signUp" 
        }),
        userControls.loginPost
    );


//logout router

router.get("/logout",userControls.logOutUser);

module.exports = router;