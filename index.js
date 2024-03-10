const express = require("express");
require("dotenv").config();
const routes = require("./routes/client/indexroutes.js");
const app = express();
const port = process.env.PORT;
const database = require("./config/connect.js");
//dung de cau hinh views trong giao dien
app.set("views", "./views");
app.set("view engine", "pug");
//end dung de cau hinh pug trong giao dien
app.use(express.static("public"));
//dung de nhung file tinh vao

//routes
routes(app);
//end routes
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
