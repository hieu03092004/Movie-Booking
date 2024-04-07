const homeRoute = require("./homeroute.js");
const usersRoute = require("./usersroute.js");
const prductsRoute = require("./productsroute.js");
module.exports = (app) => {
    app.use("/admin", homeRoute);
    app.use("/admin/users", usersRoute);
    app.use("/admin/products", prductsRoute);
};
