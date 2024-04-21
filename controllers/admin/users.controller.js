const userColumns = require("../../data/userColumns.js");
const db = require("../../config/connect.js");
const crypto = require("crypto");
const sql = require("mssql");
const config = require("../../helper/configConnect");

module.exports.index = (req, res) => {
  const query = `SELECT 
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
  ua.username,
  ua.password
FROM users u
JOIN user_roles ur ON u.user_id = ur.user_id
JOIN user_accounts ua ON ur.user_role_id = ua.user_role_id;
`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }

    res.render("admin/pages/users/index.pug", {
      pageTitle: "Người dùng",
      userColumns,
      users: results.recordset,
      slug: "users",
    });
  });
};

module.exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const query = `SELECT * FROM users WHERE user_id = ${userId}`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }

    const user = results.recordset[0];

    if (!user) {
      return res.status(404).send("User not found");
    }

    const dateOfBirth = new Date(user.date_of_birth);
    const year = dateOfBirth.getFullYear();
    const month = (dateOfBirth.getMonth() + 1).toString().padStart(2, "0");
    const day = dateOfBirth.getDate().toString().padStart(2, "0");
    user.date_of_birth = `${day}-${month}-${year}`;

    // New query
    const newQuery = `SELECT 
    u.last_name,
    b.booking_date,
    m.movie_title
FROM bookings b
JOIN showtimes st ON b.showtime_id = st.showtime_id
JOIN movies m ON b.movie_id = m.movie_id
JOIN theaters t ON st.theater_id = t.theater_id
JOIN cinemas c ON t.cinema_id = c.cinema_id
JOIN seat_prices sp ON b.seat_price_id = sp.seat_price_id
JOIN users u ON b.user_id = u.user_id
WHERE b.user_id = ${userId};
;

`;
    db.request().query(newQuery, (error, booksResults) => {
      if (error) {
        console.error("Error querying database:", error);
        return res.status(500).json({ message: "Server error" });
      }

      const books = booksResults.recordset.map((book) => {
        const bookingDate = new Date(book.booking_date);
        const year = bookingDate.getFullYear();
        const month = bookingDate.toLocaleString("en-US", { month: "short" });
        const day = bookingDate.getDate();
        book.booking_date = `${day} ${month} ${year}`;
        return book;
      });
      let groupedBooks = {};

      books.forEach((book) => {
        if (groupedBooks[book.movie_title]) {
          groupedBooks[book.movie_title].number += 1;
        } else {
          groupedBooks[book.movie_title] = { ...book, number: 1 };
        }
      });

      let newBooks = Object.values(groupedBooks);

      res.render("admin/pages/users/detailUser.pug", {
        pageTitle: `User ${userId}`,
        userColumns,
        user,
        newBooks,
        slug: "user",
      });
    });
  });
};

module.exports.createUser = (req, res) => {
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    address,
    phone,
    email,
    userName,
    password,
  } = req.body;

  const dateOfBirthString = date_of_birth;
  const dateOfBirth = new Date(dateOfBirthString);
  const formattedDateOfBirth = dateOfBirth.toISOString().split("T")[0];

  if (!req.file || !req.file.filename) {
    return res.status(400).json({ message: "Avatar is required" });
  }

  function generateRandomString(length) {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString("hex")
      .slice(0, length);
  }

  const tokenUser = generateRandomString(30);

  const avatar = req.file.filename;

  console.log(req.body, req.file, avatar);

  // const query = `INSERT INTO users (first_name, last_name, date_of_birth, gender, address, phone, email, avatar, tokenUser) VALUES (N'${first_name}', N'${last_name}', '${date_of_birth}', N'${gender}', N'${address}', '${phone}', '${email}', '${avatar}', '${tokenUser}')`;
  const sqlQueryEmail = `SELECT * FROM users WHERE  email  = '${email}'`;

  db.request().query(sqlQueryEmail, (error, results) => {
    if (error) {
      console.log("Error query Email");
      res.redirect("back");

      return;
    }
    if (results.recordsets[0][0] != undefined) {
      //tuc la co email đó rồi
      console.log("Email Exist");
      res.redirect("back");
      return;
    }
    const pool = new sql.ConnectionPool(config);
    pool
      .connect()
      .then(() => {
        // Khai báo và thực thi truy vấn
        const sqlQuery = `
                INSERT INTO users (first_name, last_name, date_of_birth, gender, address, phone, email, avatar, tokenUser)
                VALUES (@firstName, @lastName, @formattedDateOfBirth, @gender, @address, @phone, @email, @avatar, @tokenUser)
            `;

        const request = new sql.Request(pool);
        request.input("firstName", sql.NVarChar, first_name);
        request.input("lastName", sql.NVarChar, last_name);
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
                          res.redirect("/admin/users");
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

module.exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const queryUserRoleID = `SElECT user_role_id FROM user_roles WHERE user_id = ${userId}`;
  db.request().query(queryUserRoleID, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.recordset[0] === undefined) {
      return res.status(404).json({ message: "User not found" });
    }
    const user_role_id = results.recordset[0].user_role_id;
    const queryUserAccountID = `SELECT account_id FROM user_accounts WHERE user_role_id = ${user_role_id}`;
    db.request().query(queryUserAccountID, (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        return res.status(500).json({ message: "Server error" });
      }
      if (results.recordset[0] === undefined) {
        return res.status(404).json({ message: "User not found" });
      }
      const account_id = results.recordset[0].account_id;
      const query = `DELETE FROM user_accounts WHERE account_id = ${account_id}`;
      db.request().query(query, (error, results) => {
        if (error) {
          console.error("Error querying database:", error);
          return res.status(500).json({ message: "Server error" });
        }
        if (results.rowsAffected[0] === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        const queryUserRole = `DELETE FROM user_roles WHERE user_id = ${userId}`;
        db.request().query(queryUserRole, (error, results) => {
          if (error) {
            console.error("Error querying database:", error);
            return res.status(500).json({ message: "Server error" });
          }
          if (results.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "User not found" });
          }
          const queryUser = `DELETE FROM users WHERE user_id = ${userId}`;
          db.request().query(queryUser, (error, results) => {
            if (error) {
              console.error("Error querying database:", error);
              return res.status(500).json({ message: "Server error" });
            }
            if (results.rowsAffected[0] === 0) {
              return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
          });
        });
      });
    });
  });
};

module.exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const {
    first_name,
    last_name,
    date_of_birth,
    gender,
    address,
    phone,
    email,
    avatar,
  } = req.body;

  const query = `UPDATE users SET first_name = N'${first_name}', last_name = N'${last_name}', date_of_birth = '${date_of_birth}, gender = N'${gender}', address = N'${address}', phone = '${phone}', email = '${email}', avatar = '${avatar}' WHERE user_id = ${userId}`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully" });
  });
};
