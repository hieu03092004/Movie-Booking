const homeRoute = require("./home.route.js");
const usersRoute = require("./users.route.js");
const moviesRoute = require("./movies.route.js");
const ticketsRoute = require("./tickets.route.js");
module.exports = (app) => {
  app.use("/admin", homeRoute);
  app.use("/admin/users", usersRoute);
  app.use("/admin/movies", moviesRoute);
  app.use("/admin/tickets", ticketsRoute);
};
