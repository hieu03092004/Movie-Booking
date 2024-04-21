module.exports.registerPost=(req,res,next)=>{
    if(req.body.gender!="Male" &&  req.body.gender!="Female" && req.body.gender!="'Other" || !req.body.gender){
        console.log("Error gender");
        req.flash("error","Vui lòng nhập lại giới tính")
        res.redirect("back");
        return;
    }
    if(!req.body.firstName){
        console.log("Error firstName");
        req.flash("error","Vui lòng nhập họ của bạn");
        res.redirect("back");
     
        return;
    }
    if(!req.body.lastName){
        console.log("Error lastName");
        req.flash("error","Vui lòng nhập tên của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.email){
        console.log("Error email");
        req.flash("error","Vui lòng nhập tên của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        console.log("Error password");
        req.flash("error","Vui lòng mật khẩu của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.date_of_birth){
        console.log("Error date_of_birth");
        req.flash("error","Vui lòng nhập ngày sinh của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.userName){
        console.log("Error userName");
        req.flash("error","Vui lòng nhập tên đăng nhập của bạn");
        res.redirect("back");
        return;
    }
    // if(!req.body.avatar){
    //     console.log("Error avatar");
    //     res.redirect("back");
    //     return;
    // }
    next();
}
module.exports.loginPost=(req,res,next)=>{
    if(!req.body.userName){
        req.flash("error","Vui lòng nhập tên đăng nhập của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error","Vui lòng nhập mật khẩu của bạn");
        res.redirect("back");
        return;
    }
    
    next();
}
module.exports.forgotPasswordPost=(req,res,next)=>{
    if(!req.body.email){
        req.flash("error","Vui lòng nhập email của bạn");
        res.redirect("back");
        return;
    }
    next();
}
module.exports.resetPasswordPost=(req,res,next)=>{
    if(!req.body.email){
        req.flash("error","Vui lòng nhập email của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.password){
        req.flash("error","Vui lòng nhập mật khẩu của bạn");
        res.redirect("back");
        return;
    }
    if(!req.body.confirmPassword){
        req.flash("error","Vui lòng xác nhận mật khẩu của bạn");
        res.redirect("back");
        return;
    }
    if(req.body.confirmPassword!=req.body.password){
        req.flash("error","Mật khẩu không trùng khớp");
        res.redirect("back");
        return;
    }
    next();
}