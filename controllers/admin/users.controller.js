const userColumns = require("../../data/userColumns.js");
const db = require("../../config/connect.js");

module.exports.index = (req, res) => {
  const query =
    "select user_id, avatar, first_name, last_name, gender, email, phone from users";

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
    avatar,
  } = req.body;

  const query = `INSERT INTO users (first_name, last_name, date_of_birth, gender, address, phone, email, avatar) VALUES (N'${first_name}', N'${last_name}', '${date_of_birth}', N'${gender}', N'${address}', '${phone}', '${email}', '${avatar}')`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json({ message: "User added successfully" });
  });
};

module.exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = `DELETE FROM users WHERE user_id = ${userId}`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
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
