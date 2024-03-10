const homeRoute = require("./homeroute.js");
module.exports = (app) => {
  app.use("/admin", homeRoute);
};
