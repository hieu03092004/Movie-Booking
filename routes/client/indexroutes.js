
const moviesRoutes= require("./moviesroutes.js");
const homeRoutes= require("./homeroutes.js");
const aboutRoutes= require("./aboutroutes.js");
const feedbackRoutes= require("./feedbackroutes.js");
const contactRoutes= require("./contactroutes.js");
const searchRoutes= require("./searchroute.js");
const userRoutes= require("./userrouter.js");
const userMiddleware=require("../../middlewares/client/user.middleware.js");
const bookingRoutes= require("./bookingroutes.js");
module.exports =(app) =>{
    app.use(userMiddleware.infoUser);
    app.use("/", homeRoutes);
    app.use("/movies",moviesRoutes);
    app.use("/about", aboutRoutes);
    app.use("/feedback", feedbackRoutes);
    app.use("/contact", contactRoutes);
    app.use("/search", searchRoutes);
    app.use("/user", userRoutes);
    app.use("/booking", bookingRoutes);
}