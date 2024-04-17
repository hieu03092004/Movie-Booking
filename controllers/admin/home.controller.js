const db = require("../../config/connect.js");

const chartBoxUser = require("../../data/chartBoxUser.js");
const chartBoxProduct = require("../../data/chartBoxProduct.js");
const chartBoxConversion = require("../../data/chartBoxConversion.js");
const chartBoxRevenue = require("../../data/chartBoxRevenue.js");
const pieChartBox = require("../../data/pieChartBox.js");
const bigChartBox = require("../../data/bigChartBox.js");
const barChartBoxRevenue = require("../../data/barChartBoxRevenue.js");
const barChartBoxVisit = require("../../data/barChartBoxVisit.js");

module.exports.index = (req, res) => {
  const query1 = `
  SELECT TOP 6
    movies.movie_id,
    movies.movie_image,
    movies.movie_title,
    movies.director,
    ROUND(AVG(CAST(ISNULL(customer_feedback.rating, 0) AS DECIMAL(10, 1))), 1) AS average_rating
FROM 
    movies
LEFT JOIN 
    customer_feedback ON movies.movie_id = customer_feedback.movie_id
GROUP BY 
    movies.movie_id, 
    movies.movie_image,
    movies.movie_title,
    movies.director
ORDER BY 
    average_rating DESC;
    `;

  const query2 = `
    SELECT
      CASE WHEN DATEPART(WEEKDAY, st.show_date) = 1 THEN 'Sun'
          WHEN DATEPART(WEEKDAY, st.show_date) = 2 THEN 'Mon'
          WHEN DATEPART(WEEKDAY, st.show_date) = 3 THEN 'Tue'
          WHEN DATEPART(WEEKDAY, st.show_date) = 4 THEN 'Wed'
          WHEN DATEPART(WEEKDAY, st.show_date) = 5 THEN 'Thu'
          WHEN DATEPART(WEEKDAY, st.show_date) = 6 THEN 'Fri'
          WHEN DATEPART(WEEKDAY, st.show_date) = 7 THEN 'Sat'
      END AS name,
      SUM(sp.price) AS value
    FROM
        bookings AS b
        JOIN seat_prices AS sp ON b.seat_price_id = sp.seat_price_id
        JOIN showtimes AS st ON b.showtime_id = st.showtime_id
        JOIN movies AS m ON st.movie_id = m.movie_id
    WHERE
        m.movie_title = 'Exhuma'
        AND st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
    GROUP BY
        DATEPART(WEEKDAY, st.show_date)
    ORDER BY
        DATEPART(WEEKDAY, st.show_date);
    `;
  const query3 = `
    SELECT
      CASE WHEN DATEPART(WEEKDAY, st.show_date) = 1 THEN 'Sun'
          WHEN DATEPART(WEEKDAY, st.show_date) = 2 THEN 'Mon'
          WHEN DATEPART(WEEKDAY, st.show_date) = 3 THEN 'Tue'
          WHEN DATEPART(WEEKDAY, st.show_date) = 4 THEN 'Wed'
          WHEN DATEPART(WEEKDAY, st.show_date) = 5 THEN 'Thu'
          WHEN DATEPART(WEEKDAY, st.show_date) = 6 THEN 'Fri'
          WHEN DATEPART(WEEKDAY, st.show_date) = 7 THEN 'Sat'
      END AS name,
      SUM(sp.price) AS value
    FROM
        bookings AS b
        JOIN seat_prices AS sp ON b.seat_price_id = sp.seat_price_id
        JOIN showtimes AS st ON b.showtime_id = st.showtime_id
        JOIN movies AS m ON st.movie_id = m.movie_id
    WHERE
        m.movie_title = 'KungFu Panda 4'
        AND st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
    GROUP BY
        DATEPART(WEEKDAY, st.show_date)
    ORDER BY
        DATEPART(WEEKDAY, st.show_date);
    `;
  const query4 = `
    SELECT
      CASE WHEN DATEPART(WEEKDAY, st.show_date) = 1 THEN 'Sun'
          WHEN DATEPART(WEEKDAY, st.show_date) = 2 THEN 'Mon'
          WHEN DATEPART(WEEKDAY, st.show_date) = 3 THEN 'Tue'
          WHEN DATEPART(WEEKDAY, st.show_date) = 4 THEN 'Wed'
          WHEN DATEPART(WEEKDAY, st.show_date) = 5 THEN 'Thu'
          WHEN DATEPART(WEEKDAY, st.show_date) = 6 THEN 'Fri'
          WHEN DATEPART(WEEKDAY, st.show_date) = 7 THEN 'Sat'
      END AS name,
      SUM(sp.price) AS value
    FROM
        bookings AS b
        JOIN seat_prices AS sp ON b.seat_price_id = sp.seat_price_id
        JOIN showtimes AS st ON b.showtime_id = st.showtime_id
        JOIN movies AS m ON st.movie_id = m.movie_id
    WHERE
        m.movie_title = 'Deadman'
        AND st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
    GROUP BY
        DATEPART(WEEKDAY, st.show_date)
    ORDER BY
        DATEPART(WEEKDAY, st.show_date);
    `;
  const query5 = `
    SELECT
      CASE WHEN DATEPART(WEEKDAY, st.show_date) = 1 THEN 'Sun'
          WHEN DATEPART(WEEKDAY, st.show_date) = 2 THEN 'Mon'
          WHEN DATEPART(WEEKDAY, st.show_date) = 3 THEN 'Tue'
          WHEN DATEPART(WEEKDAY, st.show_date) = 4 THEN 'Wed'
          WHEN DATEPART(WEEKDAY, st.show_date) = 5 THEN 'Thu'
          WHEN DATEPART(WEEKDAY, st.show_date) = 6 THEN 'Fri'
          WHEN DATEPART(WEEKDAY, st.show_date) = 7 THEN 'Sat'
      END AS name,
      SUM(sp.price) AS value
    FROM
        bookings AS b
        JOIN seat_prices AS sp ON b.seat_price_id = sp.seat_price_id
        JOIN showtimes AS st ON b.showtime_id = st.showtime_id
        JOIN movies AS m ON st.movie_id = m.movie_id
    WHERE
        m.movie_title = 'Godzilla x Kong : The New Empire'
        AND st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
    GROUP BY
        DATEPART(WEEKDAY, st.show_date)
    ORDER BY
        DATEPART(WEEKDAY, st.show_date);
    `;
  const query6 = `
  SELECT
  payment_method,
  SUM(sp.price) AS revenue
FROM
  bookings AS b
  JOIN seat_prices AS sp ON b.seat_price_id = sp.seat_price_id
  JOIN showtimes AS st ON b.showtime_id = st.showtime_id
  JOIN movies AS m ON st.movie_id = m.movie_id
WHERE
  st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
GROUP BY
  payment_method;
    `;
  const query7 = `
  SELECT c.cinema_name, 
  CONVERT(date, st.show_date) AS show_date,
  SUM(sp.price) AS revenue
FROM cinemas c
JOIN theaters t ON c.cinema_id = t.cinema_id
JOIN showtimes st ON t.theater_id = st.theater_id
JOIN seat_prices sp ON st.showtime_id = sp.showtime_id
JOIN bookings b ON st.showtime_id = b.showtime_id
WHERE st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
GROUP BY c.cinema_name, st.show_date

UNION ALL

SELECT 'AllCinema' AS cinema_name,
  CONVERT(date, st.show_date) AS show_date,
  SUM(sp.price) AS revenue
FROM showtimes st
JOIN seat_prices sp ON st.showtime_id = sp.showtime_id
JOIN bookings b ON st.showtime_id = b.showtime_id
WHERE st.show_date BETWEEN '2024-04-15' AND '2024-04-21'
GROUP BY st.show_date;


    `;

  Promise.all([
    db.query(query1),
    db.query(query2),
    db.query(query3),
    db.query(query4),
    db.query(query5),
    db.query(query6),
    db.query(query7),
  ])
    .then((results) => {
      const topMovies = results[0].recordset;
      function calculateRevenue(data) {
        const totalRevenue = data.reduce((acc, cur) => acc + cur.value, 0);
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(totalRevenue);
      }

      chartBoxUser.number = calculateRevenue(results[1].recordset);
      chartBoxUser.chartData = results[1].recordset;

      chartBoxProduct.number = calculateRevenue(results[2].recordset);
      chartBoxProduct.chartData = results[2].recordset;

      chartBoxConversion.number = calculateRevenue(results[3].recordset);
      chartBoxConversion.chartData = results[3].recordset;

      chartBoxRevenue.number = calculateRevenue(results[4].recordset);
      chartBoxRevenue.chartData = results[4].recordset;

      const totalRevenue = results[5].recordset.reduce(
        (acc, cur) => acc + cur.revenue,
        0
      );

      pieChartBox.forEach((item, index) => {
        const paymentMethod =
          results[5].recordset[index].payment_method === "Credit Card"
            ? "CC"
            : results[5].recordset[index].payment_method;
        const percentage =
          (results[5].recordset[index].revenue / totalRevenue) * 100;
        item.name = paymentMethod;
        item.value = percentage.toFixed(2);
      });

      bigChartBox.forEach((item, index) => {
        item.All = results[6].recordset
          .filter((data) => data.cinema_name === "AllCinema")
          .map((data) => data.revenue)[index];

        item.NhaTrang = results[6].recordset
          .filter((data) => data.cinema_name === "Apolo Nha Trang")
          .map((data) => data.revenue)[index];

        item.HaNoi = results[6].recordset
          .filter((data) => data.cinema_name === "Apolo Hà Nội")
          .map((data) => data.revenue)[index];
      });

      res.render("admin/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        topMovies,
        chartBoxUser,
        chartBoxProduct,
        chartBoxConversion,
        chartBoxRevenue,
        pieChartBox,
        bigChartBox,
        barChartBoxRevenue,
        barChartBoxVisit,
      });
    })
    .catch((error) => {
      console.error("Error executing queries", error);
      res.status(500).send("Error while fetching data");
    });
};
