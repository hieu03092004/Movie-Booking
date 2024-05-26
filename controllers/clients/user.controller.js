const db = require("../../config/connect");
const crypto = require("crypto");
const sql = require("mssql");
const config = require("../../helper/configConnect");
module.exports.register = async (req, res) => {
  // no se mac dinh di vao folder views
  res.render("client/pages/user/register.pug", {
    pageTitle: "Đăng ký tài khoản",
  });
};
module.exports.profile = async (req, res) => {
  var user_account="";
  var user_password="";
  if(req.query.user_account){
     user_account=req.query.user_account;
  }
   if(req.query.user_password){
     user_password=req.query.user_password;
   } 
  // no se mac dinh di vao folder views
  const user_id = req.params.id;
  const sqlQuery = `
    SELECT 
      ua.username AS user_account,
      ua.password AS user_password,
      u.user_id,
      u.first_name,
      u.last_name,
      u.date_of_birth,
      u.gender,
      u.address,
      u.phone,
      u.email,
      u.avatar,
      u.tokenUser,
      u.created_at AS user_created_at,
      u.updated_at AS user_updated_at,
      COALESCE(SUM(sp.price), 0) AS total_spent
    FROM 
      users u
    JOIN 
      user_roles ur ON u.user_id = ur.user_id
    JOIN 
      user_accounts ua ON ur.user_role_id = ua.user_role_id
    LEFT JOIN 
      bookings b ON u.user_id = b.user_id AND YEAR(b.booking_date) = 2024
    LEFT JOIN 
      seat_prices sp ON b.seat_price_id = sp.seat_price_id
    WHERE 
      u.user_id = ${user_id}
    GROUP BY 
      ua.username, 
      ua.password, 
      u.user_id, 
      u.first_name, 
      u.last_name, 
      u.date_of_birth, 
      u.gender, 
      u.address, 
      u.phone, 
      u.email, 
      u.avatar, 
      u.tokenUser, 
      u.created_at, 
      u.updated_at;
    `;
  db.request().query(sqlQuery, (error, results) => {
    if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ message: "Server error" });
        return;
    }
    const user = results.recordsets[0][0];
     user.fullName=results.recordsets[0][0].first_name+" "+results.recordsets[0][0].last_name;
     var dob=user.date_of_birth;
     const day = String(dob.getDate()).padStart(2, '0');
     const month = String(dob.getMonth() + 1).padStart(2, '0');
     dob=`${day}/${month}/${dob.getFullYear()}`;
     user.date_of_birth=dob;
     if(user_account!=""){
        const sqlQueryAccountID=`SELECT ua.account_id, ua.username, ua.password
        FROM users AS u
        JOIN user_roles AS ur ON u.user_id = ur.user_id
        JOIN user_accounts AS ua ON ur.user_role_id = ua.user_role_id
        WHERE u.user_id = '${user_id}'`;
        db.request().query(sqlQueryAccountID, (error, results) => {
          if (error) {
              console.error("Error querying database:", error);
              res.status(500).json({ message: "Server error" });
              return;
          }
          const account_id=results.recordsets[0][0].account_id;
          const updateQuery = `
                    UPDATE user_accounts
                    SET username= '${user_account}'
                    WHERE account_id = ${account_id}
                    `;
              db.request().query(updateQuery, (error, results) => {
                if (error) {
                    console.error("Error querying database:", error);
                    res.status(500).json({ message: "Server error" });
                    return;
                }
                  req.flash("success","Thay đổi tài khoản thành công");
                  res.redirect("/user/login");
                  return;
                // Xử lý kết quả ở đây
            }); 
          // Xử lý kết quả ở đây
      });
      
     }
     if(user_password!=""){
      const sqlQueryAccountID=`SELECT ua.account_id, ua.username, ua.password
      FROM users AS u
      JOIN user_roles AS ur ON u.user_id = ur.user_id
      JOIN user_accounts AS ua ON ur.user_role_id = ua.user_role_id
      WHERE u.user_id = '${user_id}'`;
      db.request().query(sqlQueryAccountID, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        const account_id=results.recordsets[0][0].account_id;
        const updateQuery = `
                  UPDATE user_accounts
                  SET password= '${user_password}'
                  WHERE account_id = ${account_id}
                  `;
            db.request().query(updateQuery, (error, results) => {
              if (error) {
                  console.error("Error querying database:", error);
                  res.status(500).json({ message: "Server error" });
                  return;
              }
              req.flash("success","Thay đổi mật khẩu thành công");
              res.redirect("/user/login");
              return;
              // Xử lý kết quả ở đây
          }); 
        // Xử lý kết quả ở đây
    });
    
   }
    if(user_account=="" && user_password==""){
      res.render("client/pages/user/profile.pug", {
        pageTitle: "Thông tin cá nhân",
        user: user,
        user_id: user_id,
      });
    }
  }); 
};
module.exports.registerPost  = async (req, res) => {
    const firstName=req.body.firstName;
    const dateOfBirthString = req.body.date_of_birth;
    const dateOfBirth = new Date(dateOfBirthString);
    const formattedDateOfBirth = dateOfBirth.toISOString().split('T')[0];
    const address=req.body.address;
    const email=req.body.email;
    const lastName=req.body.lastName;
    const phone=req.body.phone;
    const gender=req.body.gender;
    const userName=req.body.userName
    const password=req.body.password;
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ message: "Avatar is required" });
    }
  
    const avatar = req.file.filename;
    // console.log(req.body, req.file, req.file.filename);
    function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex') // Chuyển buffer thành chuỗi hex
            .slice(0, length); // Trích xuất độ dài mong muốn
    }
    // Sử dụng hàm generateRandomString để tạo chuỗi ngẫu nhiên
    const tokenUser = generateRandomString(30);
    const sqlQueryEmail=`SELECT * FROM users WHERE  email  = '${email}'`;
   
    db.request().query(sqlQueryEmail,(error,results)=>{
            if(error){
                console.log("Error query Email");
                res.redirect("back");
                
                return;
            }
            if(results.recordsets[0][0]!=undefined){
                //tuc la co email đó rồi
                console.log("Email Exist");
                req.flash("error","Email đã tồn tại");
                res.redirect("back");
                return;
            }
            const pool = new sql.ConnectionPool(config);
            pool.connect().then(() => {
            // Khai báo và thực thi truy vấn
            const sqlQuery = `
                INSERT INTO users (first_name, last_name, date_of_birth, gender, address, phone, email, avatar, tokenUser)
                VALUES (@firstName, @lastName, @formattedDateOfBirth, @gender, @address, @phone, @email, @avatar, @tokenUser)
            `;

        const request = new sql.Request(pool);
        request.input("firstName", sql.NVarChar, firstName);
        request.input("lastName", sql.NVarChar, lastName);
        request.input("formattedDateOfBirth", sql.Date, formattedDateOfBirth);
        request.input("gender", sql.NVarChar, gender);
        request.input("address", sql.NVarChar, address);
        request.input("phone", sql.NVarChar, phone);
        request.input("email", sql.NVarChar, email);
        request.input("avatar", sql.NVarChar, avatar);
        request.input("tokenUser", sql.VarChar, tokenUser);

        request.query(sqlQuery, (error, results) => {
          if (error) {
            console.error("Loi insert du lieu", error);
            res.status(500).json({ message: "Server error" });
            return;
          }

          const sqlQueryUser = `SELECT * FROM users WHERE tokenUser = '${tokenUser}' `;
          db.request().query(sqlQueryUser, (error, results) => {
            if (error) {
              console.log("Error");
              res.redirect("back");
            } else {
              if (results.recordsets[0][0] == undefined) {
                console.log("Error query User");
                res.redirect("back");
                return;
              }
              // res.send("OK");
              const user_id = results.recordsets[0][0].user_id;
              const sqlQueryInSertUser_roles = `
                        INSERT INTO user_roles (user_id, role_id)
                        VALUES (@user_id, @role_id)
                    `;

              const requestUserRoles = new sql.Request(pool);
              requestUserRoles.input("user_id", sql.BigInt, user_id); // Sử dụng user_id đã có
              requestUserRoles.input("role_id", sql.BigInt, 3); // Thay thế role_id bằng giá trị thực tế của role_id

              requestUserRoles.query(
                sqlQueryInSertUser_roles,
                (error, results) => {
                  if (error) {
                    console.error(
                      "Error inserting data into user_roles table:",
                      error
                    );
                    res.status(500).json({ message: "Server error" });
                    return;
                  }
                  const sqlQueryuserid = `SELECT * FROM user_roles WHERE user_id = ${user_id}`;
                  db.request().query(sqlQueryuserid, (error, results) => {
                    if (error) {
                      console.log("Error");
                      res.send("Error sqlQueryuserid");
                    } else {
                      if (results.recordsets[0][0] == undefined) {
                        res.redirect("back");
                        return;
                      }
                      const user_roles = results.recordsets[0][0];
                      const user_roleId = user_roles.user_role_id;
                      const sqlQueryInSertUserAccounts = `
                                    INSERT INTO  user_accounts (username,password,user_role_id)
                                    VALUES (@username, @password,@user_role_id)
                                    `;
                      const requestUserAccount = new sql.Request(pool);
                      requestUserAccount.input(
                        "username",
                        sql.NVarChar,
                        userName
                      ); // Sử dụng user_id đã có
                      requestUserAccount.input(
                        "password",
                        sql.NVarChar,
                        password
                      ); // T
                      requestUserAccount.input(
                        "user_role_id",
                        sql.BigInt,
                        user_roleId
                      );
                      requestUserAccount.query(
                        sqlQueryInSertUserAccounts,
                        (error, results) => {
                          if (error) {
                            console.log("Error sqlQueryInSertUserAccounts");
                            res.send("Error sqlQueryInSertUserAccounts");
                            return;
                          }
                          res.cookie("tokenUser", tokenUser);
                          req.flash("success", "Đăng ký tài khoản thành công");
                          res.redirect("/");
                        }
                      );
                    }
                  });
                }
              );
            }
          });
        });
      })
      .catch((error) => {
        console.error("Ket noi khong thanh cong", error);
        res.status(500).json({ message: "Server error" });
      });
  });
};
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Đăng nhập tài khoản",
  });
};
module.exports.loginPost = async (req, res) => {
   
    const userName=req.body.userName;
    const password=req.body.password;
    const sqlQuery=`SELECT * FROM user_accounts WHERE  username  = '${userName}' and password='${password}'`;
    db.request().query(sqlQuery,(error,results)=>{
        if(error)
            console.log("Error");
        else{
            if(results.recordsets[0][0]==undefined){
                req.flash("error","Tài khoản hoặc mật khẩu không đúng");
                res.redirect("back");
                return;
            }
            const user=results.recordsets[0][0];
        
            const pool = new sql.ConnectionPool(config);
            pool.connect().then(() => {
                const accountId=user.account_id;
                const sqlQueryUserRole = `
                    SELECT user_role_id
                    FROM user_accounts
                    WHERE account_id = @account_id
                `;
          const requestUserRole = new sql.Request(pool);
          requestUserRole.input("account_id", sql.BigInt, accountId);

          requestUserRole.query(sqlQueryUserRole, (error, results) => {
            if (error) {
              console.error("Error querying user_role_id:", error);
              res.status(500).json({ message: "Server error" });
              return;
            }

            // Kiểm tra nếu không có kết quả
            if (!results.recordsets[0][0]) {
              console.log("No user_role_id found for the provided account_id");
              return;
            }
            // Lấy user_role_id từ kết quả truy vấn
            const userRoleId = results.recordsets[0][0].user_role_id;
            const sqlQueryUserId = `
                    SELECT user_id
                    FROM user_roles
                    WHERE user_role_id = @user_role_id
                    `;
                    const requestUserID = new sql.Request(pool);
                    requestUserID.input('user_role_id', sql.BigInt,userRoleId);
                    requestUserID.query(sqlQueryUserId, (error, results) => {
                        if (error) {
                            console.error("Error querying user_id:", error);
                            res.status(500).json({ message: "Server error" });
                            return;
                        }
                        // Kiểm tra nếu không có kết quả
                        if (!results.recordsets[0][0]) {
                            console.log("No user_id found for the provided user_role_id");
                            return;
                        }
                        const userID=results.recordsets[0][0].user_id;
                        const requestTokenUser= new sql.Request(pool);
                        const sqlQueryTokenUser = `
                            SELECT 
                            ur.role_id,
                            u.tokenUser
                            FROM users u
                            JOIN user_roles ur ON u.user_id = ur.user_id
                            WHERE u.user_id = @user_id;          
                        `;
                        requestTokenUser.input('user_id', sql.BigInt,userID);
                        requestTokenUser.query(sqlQueryTokenUser, (error, results) => {
                            if (error) {
                                console.error("Error querying tokenUser:", error);
                                res.status(500).json({ message: "Server error" });
                                return;
                            }
                            // Kiểm tra nếu không có kết quả
                            if (!results.recordsets[0][0]) {
                                console.log("No tokenUserfound for the provided user_id");
                                return;
                            }
                            const tokenUser=results.recordsets[0][0].tokenUser;
                            res.cookie("tokenUser",tokenUser);
                            if (
                                results.recordsets[0][0].role_id == 1 ||
                                results.recordsets[0][0].role_id == 2
                              ) {
                                res.redirect("/admin");
                                return;
                              }
                                req.flash("success","Đăng nhập thành công");
                                res.redirect("/");
                        }) 
                    })
                    
                });
               
            }).catch(error => {
                console.error("Error connecting to SQL Server:", error);
                res.status(500).json({ message: "Server error" });
            });
        }
    })
   
};
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password.pug", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
module.exports.forgotPasswordPost = async (req, res) => {
    const email=req.body.email;
   
    const sqlQuery=`SELECT * FROM users WHERE email = '${email}'`;
    db.request().query(sqlQuery,(error,results)=>{
        if(error)
            console.log("Error");
        else{
            
            if(results.recordsets[0][0]==undefined){
                req.flash("error","Email không tồn tại");
                res.redirect("back");
                return;
            }
            res.redirect("/user/password/reset");
        }
    })
    
};
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password.pug", {
    pageTitle: "Đổi mật khẩu",
  });
};
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const sqlQuery = `SELECT * FROM users WHERE email = '${email}'`;
  db.request().query(sqlQuery, (error, results) => {
    if (error) console.log("Error");
    else {
      if (results.recordsets[0][0] == undefined) {
        res.redirect("back");
        return;
      }

      const pool = new sql.ConnectionPool(config);
      pool
        .connect()
        .then(() => {
          const userId = results.recordsets[0][0].user_id;
          const sqlQueryUserRoleId = `
                SELECT user_role_id
                FROM user_roles
                WHERE user_id = @user_id
                `;
          const requestUserRoleID = new sql.Request(pool);
          requestUserRoleID.input("user_id", sql.BigInt, userId);
          requestUserRoleID.query(sqlQueryUserRoleId, (error, results) => {
            if (error) {
              console.error("Error querying UserRoleId:", error);
              res.status(500).json({ message: "Server error" });
              return;
            }
            // Kiểm tra nếu không có kết quả
            if (!results.recordsets[0][0]) {
              console.log("No UserRoleId for the provided user_id");
              return;
            }
            //truy van ra password
            const userRoleId = results.recordsets[0][0].user_role_id;
            const updateQuery = `
                    UPDATE user_accounts
                    SET password = '${password}'
                    WHERE user_role_id = ${userRoleId}
                    `;
                    db.request().query(updateQuery, (updateError, updateResults) => {
                        if (updateError) {
                            console.log("Error updating password");
                            res.status(500).json({ message: "Server error" });
                            return;
                        }
                        req.flash("success","Đổi mật khẩu thành công");
                        res.redirect("/user/login");
                    });
                }) 
                
            })   
            .catch(error => {
                console.error("Error connecting to SQL Server:", error);
                res.status(500).json({ message: "Server error" });
            });
            
        }
    })
 
 
};
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success","Đăng xuất thành công");
  res.redirect("/");
};
