const express = require("express");

require("dotenv").config();
const routes = require("./routes/client/indexroutes.js");
const adminRoutes = require("./routes/admin/indexroutes.js");
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');

const flash=require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));

const menu = require("./data/menu.js");
app.use(cookieParser());
//dung de cau hinh views trong giao dien
app.set("views", "./views");
//end dung de cau hinh pug trong giao dien
app.set("view engine", "pug");

app.use(express.static("public"));
//flash
app.use( cookieParser('keyboard cat'));
app.use(session({
    secret: '03092004',
    resave: false,
    saveUninitialized: true
  }));
  
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//end flash
//dung de nhung file tinh vao

app.locals.menu = menu;

//routes
routes(app);
adminRoutes(app);
//end routes
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
