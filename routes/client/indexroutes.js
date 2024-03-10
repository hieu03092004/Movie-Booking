const moviesRoutes = require("./moviesroutes.js");
const homeRoutes = require("./homeroutes.js");
module.exports = (app) => {
  app.use("/", homeRoutes);
  app.use("/movies", moviesRoutes);
};
