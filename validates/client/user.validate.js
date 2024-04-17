module.exports.registerPost=(req,res,next)=>{
    if(req.body.gender!="Male" &&  req.body.gender!="Female" && req.body.gender!="'Other" || !req.body.gender){
        res.redirect("back")
        return;
    }
    if(!req.body.firstName){
        res.redirect("back");
        return;
    }
    if(!req.body.lastName){
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        res.redirect("back");
        return;
    }
    if(!req.body.date_of_birth){
        res.redirect("back");
        return;
    }
    if(!req.body.userName){
        res.redirect("back");
        return;
    }
    if(!req.body.avatar){
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