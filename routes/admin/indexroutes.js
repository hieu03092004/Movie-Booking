const homeRoute = require("./homeroute.js");
const usersRoute = require("./usersroute.js");
const moviesRoute = require("./moviesroute.js");
module.exports = (app) => {
  app.use("/admin", homeRoute);
  app.use("/admin/users", usersRoute);
  app.use("/admin/movies", moviesRoute);
};
