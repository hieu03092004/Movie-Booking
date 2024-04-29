const db = require("../../config/connect");
const sql = require("mssql");
const config = require("../../helper/configConnect");

//GET allmovie
module.exports.index = (req, res) => {
  db.request().query("SELECT * FROM movies", (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    const movies = results.recordset;
    movies.forEach((item) => {
      const duration = new Date(item.movie_duration);
      const hours = duration.getUTCHours();
      const minutes = duration.getUTCMinutes();
      const seconds = duration.getUTCSeconds();
      // Định dạng lại chuỗi thời gian thành dạng HH:mm:ss
      item.movie_duration = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      const releaseDate = new Date(item.release_date);
      const year = releaseDate.getFullYear();
      const month = (releaseDate.getMonth() + 1).toString().padStart(2, "0");
      const day = releaseDate.getDate().toString().padStart(2, "0");
      // Định dạng lại chuỗi ngày thành dạng YYYY-MM-DD
      item.release_date = `${year}-${month}-${day}`;
    });
    res.render("client/pages/movies/index.pug", {
      pageTitle: "Danh sách các phim",
      movies: movies,
    });
  });
};
//detail-movie
//GET/movie/:id
module.exports.detail = (req, res) => {
  const id = req.params.id;
  const show_date=req.query.showDate;
  const sqlQuery = `SELECT * FROM movies WHERE movie_id = ${id}`;

  db.request().query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    const movie = results.recordset[0];
    const movieId = movie.movie_id;
    // Xử lý format cho movie_duration và release_date
    const duration = new Date(movie.movie_duration);
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    const seconds = duration.getUTCSeconds();
    movie.movie_duration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const releaseDate = new Date(movie.release_date);
    const year = releaseDate.getFullYear();
    const month = (releaseDate.getMonth() + 1).toString().padStart(2, "0");
    const day = releaseDate.getDate().toString().padStart(2, "0");
    movie.release_date = `${year}-${month}-${day}`;
    const pool = new sql.ConnectionPool(config);
    pool
      .connect()
      .then(() => {
        const requestShowtime = new sql.Request(pool);
        const sqlQueryShowtime = `
            SELECT DISTINCT show_date
            FROM showtimes
            WHERE movie_id = '${movieId}';
          `;

        requestShowtime.query(sqlQueryShowtime, (error, results) => {
          if (error) {
            console.error("Loi insert du lieu", error);
            res.status(500).json({ message: "Server error" });
            return;
          }
          if (results.recordsets[0][0] == undefined) {
            req.flash("error","Phim chưa có lịch chiếu");
            res.redirect("back");
            return;
          }
          
          const showDates=results.recordsets[0];
          function formatDate(dateString) {
            const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
            const date = new Date(dateString);
            const dayOfWeek = daysOfWeek[date.getDay()];
            const dayOfMonth = date.getDate();
            const month = date.getMonth() + 1;
        
            return {
              rank: dayOfWeek,
              date: `${dayOfMonth}/${month}`
            };
        }
          const formattedDates = showDates.map(item => {
            const { rank, date } = formatDate(item.show_date);
            return {
                rank,
                date
            };
        });
          if(show_date==undefined){
            res.render("client/pages/movies/detail.pug", {
              pageTitle: "Chi tiết phim",
              movie: movie,
              showDates: formattedDates,
              // Truyền dữ liệu phim cho view
            });
            return;
          }
          function chuyenDoiNgay(dateString) {
            // Chia chuỗi ngày thành mảng gồm ngày, tháng, năm
            var parts = dateString.split("-");
            
            // Định dạng lại chuỗi ngày
            var formattedDate = parts[2] + "/" + parts[1] + "/" + parts[0];
            
            return formattedDate;
          }
        
        
          var show_dateResults=chuyenDoiNgay(show_date);
          const requestTheatertime = new sql.Request(pool);
          const sqlQueryTheatertime = `
            SELECT 
                t.theater_name,
                c.cinema_name,
                s.show_time,
                s.showtime_id,
                t.theater_id
            FROM 
                showtimes s
            JOIN 
                theaters t ON s.theater_id = t.theater_id
            JOIN 
                cinemas c ON t.cinema_id = c.cinema_id
            WHERE 
                s.movie_id = '${movieId}'
                AND s.show_date = '${show_date}';
            `;
          requestTheatertime.query(sqlQueryTheatertime, (error, results) => {
            if (error) {
              console.error("loi truy van du lieu", error);
              res.status(500).json({ message: "Server error" });
              return;
            }
            function convertTimeToLocal(showTime) {
              const time = new Date(showTime);
              const hours = time.getUTCHours().toString().padStart(2, '0');
              const minutes = time.getUTCMinutes().toString().padStart(2, '0');
              return `${hours}:${minutes}`;
            }
            const showtimes = results.recordset;
            showtimes.forEach(item => {
              item.show_time = convertTimeToLocal(item.show_time);
            });
            res.render("client/pages/movies/detail.pug", {
              pageTitle: "Chi tiết phim",
              movie: movie,
              showDates: formattedDates,
              showtimes: showtimes,
              show_date: show_dateResults,
              // Truyền dữ liệu phim cho view
            });
          });
            // Truyền dữ liệu phim cho view
        });
      })
      .catch((error) => {
        console.error("Ket noi khong thanh cong", error);
        res.status(500).json({ message: "Server error" });
      });

  });
};
