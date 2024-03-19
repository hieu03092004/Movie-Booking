const moviesRoutes = require("./moviesroutes.js");
const homeRoutes = require("./homeroutes.js");
const aboutRoutes = require("./aboutroutes.js");
const feedbackRoutes = require("./feedbackroutes.js");
const contactRoutes = require("./contactroutes.js");
const moviedetailsRoutes = require("./moviedetailsroutes.js");
module.exports = (app) => {
  app.use("/", homeRoutes);
  app.use("/movies", moviesRoutes);
  app.use("/about", aboutRoutes);
  app.use("/feedback", feedbackRoutes);
  app.use("/contact", contactRoutes);
  app.use("/moviedetails", moviedetailsRoutes);
};
