const ticketColumns = require("../../data/ticketColumns.js");
const db = require("../../config/connect.js");

module.exports.index = (req, res) => {
  const query = `
    SELECT 
        bookings.booking_id,
        movies.movie_title,
        CONCAT(users.first_name, ' ', users.last_name) AS fullName,
        showtimes.show_date,
        showtimes.show_time,
        CONCAT(seats.seat_row, seats.seat_column) AS seat,
        seat_prices.price,
        bookings.payment_method,
        bookings.booking_date
    FROM 
        bookings
    JOIN 
        users ON bookings.user_id = users.user_id
    JOIN 
        showtimes ON bookings.showtime_id = showtimes.showtime_id
    JOIN 
        movies ON bookings.movie_id = movies.movie_id
    JOIN 
        seats ON bookings.seat_id = seats.seat_id
    JOIN 
        seat_prices ON bookings.seat_price_id = seat_prices.seat_price_id;
  `;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }

    const tickets = results.recordset.map((ticket) => {
      let showDate = ticket.show_date
        .toISOString()
        .split("T")[0]
        .split("-")
        .reverse()
        .join("-");
      let showTime = ticket.show_time.toISOString().split("T")[1].split(".")[0];
      let formattedPrice = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(ticket.price);
      let bookingDate = ticket.booking_date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "UTC",
      });
      return {
        ...ticket,
        show_date: showDate,
        show_time: showTime,
        price: formattedPrice,
        booking_date: bookingDate,
      };
    });

    res.render("admin/pages/tickets/index.pug", {
      pageTitle: "Tickets",
      ticketColumns,
      tickets,
      slug: "tickets",
    });
  });
};
