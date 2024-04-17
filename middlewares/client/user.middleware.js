const db = require("../../config/connect");
module.exports.infoUser= async (req,res,next)=>{
  if(req.cookies.tokenUser){
    const userNameQuery="";
    const tokenUser=req.cookies.tokenUser;
    const sqlQuery = `SELECT * FROM users WHERE  tokenUser = '${tokenUser}'`;
    db.request().query(sqlQuery,(error,results)=>{
      if(error)
          console.log("Error");
      else{
          if(results.recordsets[0][0]==undefined){
              next();
          }
          else {
            const userNameQuery = results.recordsets[0][0].last_name;
            // Gán giá trị userNameQuery vào res.locals.userName
            res.locals.userName = userNameQuery;
            next(); // Tiếp tục xử lý middleware tiếp theo
          }
      }
    })
  }
  else
    next();
}