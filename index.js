const express = require("express");
require("dotenv").config();
const routes = require("./routes/client/indexroutes.js");
const adminRoutes = require("./routes/admin/indexroutes.js");
const app = express();
const port = process.env.PORT;

const menu = require("./data/menu.js");

//dung de cau hinh views trong giao dien
app.set("views", "./views");
//end dung de cau hinh pug trong giao dien
app.set("view engine", "pug");

app.use(express.static("public"));
//dung de nhung file tinh vao

app.locals.menu = menu;

//routes
routes(app);
adminRoutes(app);
//end routes
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
