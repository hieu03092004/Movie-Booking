const db = require("../../config/connect");
const sql = require("mssql");
const config = require("../../helper/configConnect");
module.exports.booking = (req, res) => {
  const id = req.params.id;
  const sqlQuery = `SELECT * FROM movies WHERE  movie_id  = '${id}'`;
  const show_date = req.params.showdate;
  const show_time = req.params.showtime;
  db.request().query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    if (results.recordsets[0][0] == undefined) {
      res.redirect("back");
      return;
    }
    const movie = results.recordsets[0][0];
    movie.show_time = show_time;
    movie.show_date = show_date;

        const pool = new sql.ConnectionPool(config);
        pool.connect().then(() => {
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
                    const date = new Date(show_date);
                    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

                    if(dayOfWeek!="Saturday" && dayOfWeek!="Sunday"){
                        priceArray.forEach((price,index) => {
                            if(index==0)
                                priceArray[index]=60000;
                            if(index==1)
                                priceArray[index]=90000;
                        });
                    }
                    else{
                        priceArray.forEach((price,index) => {
                            if(index==0)
                                priceArray[index]=90000;
                            if(index==1)
                                priceArray[index]=120000;
                        });
                    }
                    res.render("client/pages/booking/index.pug",{
                        pageTitle:"Trang booking",
                        id:id,
                        movie:movie,
                        price:priceArray,
                    });    
                })
                   
            }).catch(error => {
                console.error("Ket noi khong thanh cong", error);
                res.status(500).json({ message: "Server error" });
            });
    })  
};
module.exports.bookingPayment = (req, res) => {
  const dayBooking = req.body.day;
  const tokenUser = req.cookies.tokenUser;
  const movie_title = req.body.movie;
  const movieShowTime = req.body.show;
  const seats = req.body.seats;
  const id = req.params.id;
  const movie = {
    movieName: movie_title,
    time: movieShowTime,
    seats: seats,
    movie_id: id,
  };
  //h phai insert data do
  const pool = new sql.ConnectionPool(config);
  pool
    .connect()
    .then(() => {
      // truy van ra nguoi dung thong qua token
      const requestUser = new sql.Request(pool);
      const sqlQueryUser = `
            SELECT last_name, address, phone, email
            FROM users
            WHERE tokenUser = @tokenUser
        `;
      requestUser.input("tokenUser", sql.VarChar, tokenUser);
      //userName phone Email oki dia chi
      requestUser.query(sqlQueryUser, (error, results) => {
        if (error) {
          console.log("Error query User");
          res.send("OK");
          return;
        }
        if (results.recordsets[0] == undefined) {
          res.send("OK");
          return;
        }
        const user = results.recordsets[0][0];
        const currentDate = new Date();

        // Mảng chứa tên các ngày trong tuần
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

                const dayName = daysOfWeek[currentDate.getDay()];
                
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                
                const day = currentDate.getDate().toString().padStart(2, '0');
                
                const year = currentDate.getFullYear(); // Lấy năm hiện tại
                const date = new Date(dayBooking);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                // Định dạng lại ngày theo yêu cầu  
                const formattedDate = `${dayName}-${month}-${day}-${year}`;                
                const data=req.body;
                const seatArray = data.seats.split(',');
                let totalPayment=0;
                seatArray.forEach(seat => {
                    const column=seat[0];
                    if(dayOfWeek!="Saturday" && dayOfWeek!="Sunday"){
                        if(column=='A' || column=='B'){
                            totalPayment+=60000;
                        }
                        else
                            totalPayment+=90000;
                    }
                    else{
                        if(column=='A' || column=='B'){
                            totalPayment+=90000;
                        }
                        else
                            totalPayment+=120000;
                    }   
                });
                function formatPrice(price) {
                    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                }
                const formattedTotalPayment = formatPrice(totalPayment);
                // console.log(formattedTotalPayment);
                // Hiển thị kết quả
                
                res.render("client/pages/booking/payment.pug",{
                    pageTitle:"Trang thanh Toán",
                    movie:movie,
                    user:user,
                    Date:formattedDate,
                    totalPayment:formattedTotalPayment,
                    dayBooking:dayBooking
                });
            });
             
        // Đoạn mã để thực hiện sau khi kết nối thành công
    }).catch(error => {
        console.error("Kết nối không thành công", error);
        res.status(500).json({ message: "Lỗi máy chủ" });
    });
};
module.exports.bookingTicketShow  = (req, res) => {

    const movieName=req.body.movieName;
    const showTime=req.body.showTime;
    const totalPayment=req.body.price;
    const tokenUser=req.cookies.tokenUser;
    const dayPayment=req.body.dayPayment;
    const dayBooking=req.body.dayBooking;
    // const currentDate = new Date();
    
    // Định dạng lại ngày theo yêu cầu
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
            res.redirect("/user/login");
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
            dayPayment:dayPayment,
            totalPayment:totalPayment,
            showTime:showTime,
            movieName: movieName,
            seats:seats,
            totalSeat:totalSeats,
            dayBooking:dayBooking
        }
        res.render("client/pages/booking/ticketShow.pug",{
            pageTitle:"Chi tiết vé",
            user:user,
            ticketDetail:ticketDetail,
            success:"Đặt vé thành công"
        });
        
    });
};
