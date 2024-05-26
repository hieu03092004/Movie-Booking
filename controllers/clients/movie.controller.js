const db = require("../../config/connect");
const sql = require("mssql");
const config = require("../../helper/configConnect");

//GET allmovie
module.exports.index = (req, res) => {
  var language="";
  var genre="";
  if(req.query.language){
    language=req.query.language;
  }
  if(req.query.genre){
    genre=req.query.genre;
  }
  if(language=="" && genre==""){
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
      return;
    });
  } 
  if(language!=""){
    db.request().query(`SELECT * FROM movies WHERE movie_language='${language}'`, (error, results) => {
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
      return;
    });
  }
  if(genre!=""){
    db.request().query(`SELECT * FROM movies WHERE genre='${genre}'`, (error, results) => {
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
      return;
    });
  }
};
//detail-movie
//GET/movie/:id
module.exports.detail = (req, res) => {
  const id = req.params.id;
  const show_date=req.query.showDate;
  const sqlQuery = `SELECT 
    m.*,
    cf.feedback_id,
    cf.user_id,
    cf.rating,
    cf.comment,
    cf.feedback_date
  FROM 
    movies m
  JOIN 
    customer_feedback cf ON m.movie_id = cf.movie_id
  WHERE 
    m.movie_id =${id};`;
  let cinema_name="";
  let theater_name="";
  if(req.query.cinema){
  cinema_name=req.query.cinema;
  }
  if(req.query.theater){
    theater_name=req.query.theater;
  }
  db.request().query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    const movie = results.recordset[0];
    let feedbacks = [];
    for(let i=0;i<results.recordset.length;i++){
      let obj={
        rating:results.recordset[i].rating,
        comment:results.recordset[i].comment,
        feedback_date:results.recordset[i].feedback_date
      }
      feedbacks.push(obj);
    }
    function convertFeedbackDate(dateString) {
      // Tạo một đối tượng Date từ chuỗi ngày tháng
      let date = new Date(dateString);
    
      // Lấy ra ngày, tháng và năm từ đối tượng Date (theo múi giờ UTC)
      let day = date.getUTCDate();
      let month = date.getUTCMonth() + 1; // Tháng bắt đầu từ 0
      let year = date.getUTCFullYear();
    
      // Chuyển đổi ngày và tháng sang chuỗi với định dạng dd/mm/yyyy
      let formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`;
    
      return formattedDate;
    }
    feedbacks = feedbacks.map(item=>{
      item.feedback_date = convertFeedbackDate(item.feedback_date);
      return item;
    })
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
              cinema_name:cinema_name,
              theater_name:theater_name,
              feedbacks:feedbacks
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
          let sqlQueryTheatertime="";
          if(cinema_name==""  && theater_name==""){
          sqlQueryTheatertime = `
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
                AND s.show_date = '${show_date}'
            `;
          } 
            //neu co cinema_name va ca theater_name
            if(cinema_name!="" && theater_name!=""){
              sqlQueryTheatertime = `
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
                  AND s.show_date = '${show_date}'
                  AND c.cinema_name = N'${cinema_name}'
                  AND t.theater_name = N'${theater_name}'
              `;

            }
            if(cinema_name!="" && theater_name==""){
            sqlQueryTheatertime = `
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
                AND s.show_date = '${show_date}'
                AND c.cinema_name = N'${cinema_name}'
            `;
          }
          if(cinema_name=="" && theater_name!=""){
            sqlQueryTheatertime = `
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
                AND s.show_date = '${show_date}'
                AND t.theater_name = N'${theater_name}'
            `;
          }
          
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
              cinema_name:cinema_name,
              theater_name:theater_name,
              feedbacks:feedbacks
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
module.exports.feedback = (req, res) => {
  const movieId = req.params.id;
  const { rating, input_feedback } = req.body;
  const tokenUser=req.cookies.tokenUser;
  if(tokenUser==undefined){
    req.flash("error","Vui lòng đăng nhập để thực hiện chức năng này");
    res.redirect("/user/login");
    return;
  }
  const sqlQuery = `SELECT * FROM users WHERE tokenUser='${tokenUser}'`;
  db.request().query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    const userId = results.recordset[0].user_id;
    const sqlQueryInsert = `
      INSERT INTO customer_feedback (user_id, movie_id, rating, comment, feedback_date)
      VALUES ('${userId}', '${movieId}', '${rating}', N'${input_feedback}', GETDATE());
    `;
    db.request().query(sqlQueryInsert, (error, results) => {
      if (error) {
        console.error("Error querying database:", error);
        res.status(500).json({ message: "Server error" });
        return;
      }
      res.redirect(`/movies/${movieId}`);
    });
  })
}