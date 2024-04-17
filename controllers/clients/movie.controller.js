const db = require("../../config/connect");
const sql = require('mssql');
const config = {
    user: 'sa',
    password: '03092004',
    server: 'localhost',
    database: 'ApolloCinemaCuoiCungKhongDoiNua',
    options: {
        trustServerCertificate: true // Nếu bạn sử dụng SSL
    }
};
//GET allmovie
module.exports.index = (req, res) => {
  db.request().query("SELECT * FROM movies", (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    const movies=results.recordset;
    movies.forEach(item=>{
        const duration = new Date(item.movie_duration);
        const hours = duration.getUTCHours();
        const minutes = duration.getUTCMinutes();
        const seconds = duration.getUTCSeconds();
        // Định dạng lại chuỗi thời gian thành dạng HH:mm:ss
        item.movie_duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        const releaseDate = new Date(item.release_date);
        const year = releaseDate.getFullYear();
        const month = (releaseDate.getMonth() + 1).toString().padStart(2, '0');
        const day = releaseDate.getDate().toString().padStart(2, '0');
        // Định dạng lại chuỗi ngày thành dạng YYYY-MM-DD
        item.release_date = `${year}-${month}-${day}`;
    });
    res.render("client/pages/movies/index.pug", {
      pageTitle: "Danh sách các phim",
      movies:movies
    });
  });
};
//detail-movie
//GET/movie/:id
module.exports.detail = (req, res) => {
   const id=req.params.id;
   const sqlQuery = `SELECT * FROM movies WHERE movie_id = ${id}`;
    
   db.request().query(sqlQuery, (error, results) => {
       if (error) {
           console.error("Error querying database:", error);
           res.status(500).json({ message: "Server error" });
           return;
       }
       const movie = results.recordset[0];
       const movieId=movie.movie_id;
       // Xử lý format cho movie_duration và release_date
           const duration = new Date(movie.movie_duration);
           const hours = duration.getUTCHours();
           const minutes = duration.getUTCMinutes();
           const seconds = duration.getUTCSeconds();
           movie.movie_duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
           
           const releaseDate = new Date(movie.release_date);
           const year = releaseDate.getFullYear();
           const month = (releaseDate.getMonth() + 1).toString().padStart(2, '0');
           const day = releaseDate.getDate().toString().padStart(2, '0');
           movie.release_date = `${year}-${month}-${day}`;
           const pool = new sql.ConnectionPool(config);
           pool.connect().then(() => {
              const requestShowtime = new sql.Request(pool);
              const sqlQueryShowtime=`SELECT show_time FROM showtimes WHERE movie_id = '${movieId}' `;
              requestShowtime.query(sqlQueryShowtime, (error, results) => {
                  if (error) {
                      console.error("Loi insert du lieu", error);
                      res.status(500).json({ message: "Server error" });
                      return;
                  }
                  if(results.recordsets[0][0]==undefined){
                    res.redirect("back");
                    return;
                  }
                  const showTime=results.recordsets[0][0].show_time;
                  const showTimeDate = new Date(showTime);
                  const hoursShowtime = showTimeDate.getHours().toString().padStart(2, '0'); // Lấy giờ và định dạng thành chuỗi có độ dài 2 ký tự
                  const minutesShowtime = showTimeDate.getMinutes().toString().padStart(2, '0'); // Lấy phút và định dạng thành chuỗi có độ dài 2 ký tự
                  const formattedShowTime = `${hoursShowtime}:${minutesShowtime}`;
                 // Kết hợp giờ và phút thành chuỗi định dạng "HH:MM"
                    res.render("client/pages/movies/detail.pug", {
                      pageTitle: "Chi tiết phim",
                      movie:movie,
                      show_time:formattedShowTime
                       // Truyền dữ liệu phim cho view
                    });
                });
                
            }).catch(error => {
                console.error("Ket noi khong thanh cong", error);
                res.status(500).json({ message: "Server error" });
            });
           
       // Truyền dữ liệu admin cho view
    
   });
};

