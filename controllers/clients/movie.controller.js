const db = require("../../config/connect");
const sql = require('mssql');
const config = require('../../helper/configConnect');

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
              const sqlQueryShowtime = `
              SELECT show_date, STRING_AGG(show_time, ', ') AS show_times
              FROM showtimes
              WHERE movie_id = '${movieId}'
              GROUP BY show_date;
          `;
          
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
                  const showtimes=results.recordsets[0];
                
                 
                
                  const showtimeMap = new Map();

                  // Duyệt qua từng phần tử trong mảng result
                  for (const item of  showtimes) {
                      const showDate = item.show_date.toISOString().split('T')[0]; // Lấy ngày
                      const showTimes = item.show_times.split(', '); // Tách chuỗi show_times thành mảng các showtime
                  
                      // Loại bỏ các showtime trùng nhau và lưu vào Map
                      showtimeMap.set(showDate, [...new Set(showTimes)]);
                  }
                  
                  // Chuyển Map thành mảng kết quả mới
                  const formattedShowtimes = [...showtimeMap].map(([showDate, showTimes]) => ({
                    show_date: showDate,
                    show_times: showTimes.map(time => {
                      const [hours, minutes, seconds] = time.split(':');
                      return `${hours}:${minutes}`;
                    }).join(', ')
                  }));
                  const dateString = formattedShowtimes[0].show_date;
                  //res.send("OK");
                  
                  
                 
                  const dateParts = dateString.split('-');

                  // Lấy năm và tháng từ mảng phần tử
                  const year = dateParts[0];
                  const month = dateParts[1];

                   
                  
                 
                  const formatDate = (dateString) => {
                    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
                    const date = new Date(dateString);
                    const dayOfWeek = days[date.getDay()];
                    const dayOfMonth = date.getDate();
                  
                    return { dayOfWeek, dayOfMonth };
                };
                  const resultShowtimes = [];
                  
                  for (let i = 0; i < formattedShowtimes.length; i++) {
                    const formattedDate = formatDate(formattedShowtimes[i].show_date);
                    const showTimes = formattedShowtimes[i].show_times.split(', ');
                    const showDate=formattedShowtimes[i].show_date;                                                                
                    const formattedShowtime = {
                         // Lấy ngày
                        rank:formattedDate.dayOfWeek , // Thêm key rank với giá trị index + 1
                        day: formattedDate.dayOfMonth, // Tạo chuỗi day theo định dạng mong muốn
                        showtimes: {
                            showDate: showDate,
                            showTimes: showTimes
                        } // Sử dụng mảng showTimes đã tách
                        
                    };
                    resultShowtimes.push(formattedShowtime);
                
                }
                    res.render("client/pages/movies/detail.pug", {
                      pageTitle: "Chi tiết phim",
                      movie:movie,
                      showTimes:resultShowtimes,
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

