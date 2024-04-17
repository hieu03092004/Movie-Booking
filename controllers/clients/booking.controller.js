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
module.exports.booking  = (req, res) => {

    const id=req.params.id;
    const sqlQuery=`SELECT * FROM movies WHERE  movie_id  = '${id}'`;
    db.request().query(sqlQuery, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        if(results.recordsets[0][0]==undefined){
            res.redirect("back");
            return;
        }
        const movie=results.recordsets[0][0];
        const pool = new sql.ConnectionPool(config);
         pool.connect().then(() => {
              const requestShowtime = new sql.Request(pool);
              const sqlQueryShowtime=`SELECT show_time FROM showtimes WHERE movie_id = '${id}' `;
              requestShowtime.query(sqlQueryShowtime, (error, results) => {
                  if (error) {
                      console.error("Loi truy van showtime du lieu", error);
                        res.redirect("back");
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
                  const movieShowTime={
                    title:movie. movie_title,
                    movieShowTime:formattedShowTime
                  };
                  const requestPrice = new sql.Request(pool);
                  const sqlQueryPrice = `SELECT DISTINCT price FROM seat_prices`;
                  requestPrice.query( sqlQueryPrice, (error, results) => {
                        if(error){
                            res.redirect("back");
                            return;
                        }
                        if(results.recordsets[0][0]==undefined){
                            res.redirect("back");
                            return;
                        }
                        const prices=results.recordsets
                        const priceArray = prices.flatMap(subArray => subArray.map(item => item.price));
                        res.render("client/pages/booking/index.pug",{
                            pageTitle:"Trang booking",
                            id:id,
                            movie:movieShowTime,
                            price:priceArray
                        });    
                  })
                 
          
                //  Kết hợp giờ và phút thành chuỗi định dạng "HH:MM"
                   
                });
                
            }).catch(error => {
                console.error("Ket noi khong thanh cong", error);
                res.status(500).json({ message: "Server error" });
            });
      
    })
  
    //do ra giao dien id cua phim

    // no se mac dinh di vao folder views
    
};
module.exports.bookingPayment= (req, res) => {
    const tokenUser=req.cookies.tokenUser;
    const movie_title=req.body.movie;
    const movieShowTime=req.body.show;
    const seats=req.body.seats;
    const id=req.params.id
    const movie={
        movieName: movie_title,
        time:movieShowTime,
        seats:seats,
        movie_id:id
    };
    // h phai insert data do
    const pool = new sql.ConnectionPool(config);
    pool.connect().then(() => {
        // truy van ra nguoi dung thong qua token
            const requestUser = new sql.Request(pool);
            const sqlQueryUser = `
            SELECT last_name, address, phone, email
            FROM users
            WHERE tokenUser = @tokenUser
        `;  
            requestUser.input('tokenUser', sql.VarChar, tokenUser);
            //userName phone Email oki dia chi
            requestUser.query(sqlQueryUser, (error, results) => {
                if(error){
                    console.log("Error query User")
                    res.send("OK");
                    return;
                }
                if(results.recordsets[0]==undefined){
                    res.send("OK");
                    return
                }
                const user=results.recordsets[0][0];
                const currentDate = new Date();

                // Mảng chứa tên các ngày trong tuần
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                const dayName = daysOfWeek[currentDate.getDay()];
                
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                
                const day = currentDate.getDate().toString().padStart(2, '0');
                
                const year = currentDate.getFullYear(); // Lấy năm hiện tại
                
                // Định dạng lại ngày theo yêu cầu
                const formattedDate = `${dayName}-${month}-${day}-${year}`;                
                const data=req.body;
                const seatArray = data.seats.split(',');
                let totalPayment=0;
                seatArray.forEach(seat => {
                    const column=seat[0];
                    if(column=='I' || column=='H' || column=='G'){
                        totalPayment+=90000
                    }
                    else
                        totalPayment+=60000;
                    
                });
                function formatPrice(price) {
                    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                }
                const formattedTotalPayment = formatPrice(totalPayment);
                // Hiển thị kết quả
                res.render("client/pages/booking/payment.pug",{
                    pageTitle:"Trang thanh Toán",
                    movie:movie,
                    user:user,
                    Date:formattedDate,
                    totalPayment:formattedTotalPayment,
                });
            });
             
        // Đoạn mã để thực hiện sau khi kết nối thành công
    }).catch(error => {
        console.error("Kết nối không thành công", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    });
};
module.exports.bookingTicketShow  = (req, res) => {
    // no se mac dinh di vao folder views
    const movieID=req.params.id;
    const movieName=req.body.movieName;
    const showTime=req.body.showTime;
    const ticketPrice=req.body.price;
    const tokenUser=req.cookies.tokenUser;
    const currentDate = new Date();

    // Mảng chứa tên các ngày trong tuần
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayName = daysOfWeek[currentDate.getDay()];
    
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    
    const day = currentDate.getDate().toString().padStart(2, '0');
    
    const year = currentDate.getFullYear(); // Lấy năm hiện tại
    
    // Định dạng lại ngày theo yêu cầu
    const formattedDate = `${dayName}-${month}-${day}-${year}`;
    const data=req.body;
    const seatArray = data.seat.split(',');
    const seats=seatArray.join(', ');
    const totalSeats=seatArray.length;
    const sqlQuery=`SELECT *FROM users where tokenUser='${tokenUser}'`
    db.request().query(sqlQuery, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        if(results.recordsets[0][0]==undefined){
            res.send("Error");
            return;
        }
        const userQuery=results.recordsets[0][0];
        const fullName =userQuery.first_name + ' ' + userQuery.last_name;
        const user={
            name:fullName,
            address:userQuery.address,
            email:userQuery.email,
            phone:userQuery.phone,
            userID:userQuery.user_id
        }
        const ticketDetail={
            date:formattedDate,
            price:ticketPrice,
            time:showTime,
            movieName: movieName,
            seats:seats,
            totalSeat:totalSeats
        }
        const pool = new sql.ConnectionPool(config);
        pool.connect().then(() => {
            const requesshowDate = new sql.Request(pool);
            const sqlQueryshowDate = `
                SELECT show_date
                FROM showtimes
                WHERE movie_id = @movie_id
            `;  
            requesshowDate.input('movie_id', sql.BigInt,movieID );
            requesshowDate.query(sqlQueryshowDate, (error, results) => {
                if(error){
                    console.log("Error query User")
                    res.send("OK");
                    return;
                }
                const showDates=results.recordsets[0];
                const uniqueDates = Array.from(new Set(showDates.map(item => item.show_date.toISOString().slice(0, 10))))
                    .map(date => {
                        const showDate = new Date(date);
                        const options = { weekday: 'short', month: 'short', day: '2-digit', year: 'numeric' };
                        return showDate.toLocaleDateString('en-US', options);
                    });
                    res.render("client/pages/booking/ticketShow.pug",{
                        pageTitle:"Chi tiết vé",
                        user:user,
                        ticketDetail:ticketDetail,
                        showDate:uniqueDates
                    });
            })
        })
        .catch(error => {
            console.error("Kết nối không thành công", error);
            res.status(500).json({ message: "Lỗi máy chủ" });
        });
        
      
    });
};