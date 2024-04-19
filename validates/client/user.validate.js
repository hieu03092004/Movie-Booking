module.exports.registerPost=(req,res,next)=>{
    if(req.body.gender!="Male" &&  req.body.gender!="Female" && req.body.gender!="'Other" || !req.body.gender){
        console.log("Error gender");
        res.redirect("back");
        return;
    }
    if(!req.body.firstName){
        console.log("Error firstName");
        res.redirect("back");
     
        return;
    }
    if(!req.body.lastName){
        console.log("Error lastName");
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        console.log("Error email");
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        console.log("Error password");
        res.redirect("back");
        return;
    }
    if(!req.body.date_of_birth){
        console.log("Error date_of_birth");
        res.redirect("back");
        return;
    }
    if(!req.body.userName){
        console.log("Error userName");
        res.redirect("back");
        return;
    }
    if(!req.body.avatar){
        console.log("Error avatar");
        res.redirect("back");
        return;
    }
    next();
}
module.exports.loginPost=(req,res,next)=>{
    if(!req.body.userName){
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        res.redirect("back");
        return;
    }
    
    next();
}
module.exports.forgotPasswordPost=(req,res,next)=>{
    if(!req.body.email){
        res.redirect("back");
        return;
    }
    next();
}
module.exports.resetPasswordPost=(req,res,next)=>{
    if(!req.body.email){
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        res.redirect("back");
        return;
    }
    if(!req.body.confirmPassword){
        res.redirect("back");
        return;
    }
    if(req.body.confirmPassword!=req.body.password){
        res.redirect("back");
        return;
    }
    next();
}