const express = require("express");
require("dotenv").config();
const routes = require("./routes/client/indexroutes.js");
const adminRoutes = require("./routes/admin/indexroutes.js");
const app = express();
const port = process.env.PORT;

const menu = require("./data/menu.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//dung de cau hinh views trong giao dien
app.set("views", "./views");
//end dung de cau hinh pug trong giao dien
app.set("view engine", "pug");

//dung de nhung file tinh vao
app.use(express.static("public"));

app.locals.menu = menu;

//routes
routes(app);
adminRoutes(app);
//end routes

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
