const db = require("../../config/connect");
const sql = require("mssql");
const config = require("../../helper/configConnect");
module.exports.booking = (req, res) => {
   const showtime_id = req.params.showtime_id;
   const theater_id = req.params.theater_id;
   const sqlQuery = `SELECT 
        sp.seat_id,
        sp.price,
        s.seat_type,
        s.seat_row,
        s.seat_column,
        st.show_time,
        st.movie_id,
        st.show_date,
        c.cinema_id
        FROM 
        seat_prices sp
        JOIN 
        seats s ON sp.seat_id = s.seat_id
        JOIN 
        showtimes st ON sp.showtime_id = st.showtime_id
        JOIN
        theaters t ON st.theater_id = t.theater_id
        JOIN
        cinemas c ON t.cinema_id = c.cinema_id
        WHERE 
        st.theater_id = ${theater_id}
        AND sp.showtime_id = ${showtime_id}
        ORDER BY 
        s.seat_row ASC,
        s.seat_column ASC;
        `;
    db.request().query(sqlQuery, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        const data = results.recordsets[0];
        const id=data[0].movie_id;
        const cinema_id=results.recordsets[0][0].cinema_id;
        const show_date=data[0].show_date;
        data.forEach((item) => {
            item.seat_name=item.seat_row + item.seat_column.toString();
        });
        const newArray = [];
        for (let i = 0; i < data.length; i += 5) {
            newArray.push(data.slice(i, i + 5));
        }
        db.request().query(`SELECT * FROM movies WHERE movie_id=${id}`, (error, results) => {
            if (error) {
                console.error("Error querying database:", error);
                res.status(500).json({ message: "Server error" });
                return;
            }
            
            let movie = results.recordsets[0][0];
            var results={
                showtime_id:showtime_id,
                cinema_id:cinema_id,
                movie_id:id,
                theater_id:theater_id,
                show_date:show_date,
                movie_name:movie.movie_title
            }
            if(cinema_id==1){
                results.employee_id=1;
            }
            else if(cinema_id==2){
                results.employee_id=2;
            }
            else if(cinema_id==3){
                results.employee_id=3;
            }
            function convertTimeToLocal(showTime) {
                const time = new Date(showTime);
                const hours = time.getUTCHours().toString().padStart(2, '0');
                const minutes = time.getUTCMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            }
            movie.show_time=convertTimeToLocal(data[0].show_time);
            res.render("client/pages/booking/index.pug", {
                pageTitle: "Trang booking",
                data: newArray,
                movie: movie,
                results:results
            });
        }); // Add closing parenthesis here
    });
};    
module.exports.bookingPayment = (req, res) => {
    const tokenUser=req.cookies.tokenUser;
    const ans=req.body;
    if(tokenUser==undefined){
        req.flash("error", "Vui lòng đăng nhập để tiếp tục");
        res.redirect("/user/login");
        return;
    }
    var seat_ids=req.body.seats;
    db.request().query(`SELECT * FROM users WHERE tokenUser='${tokenUser}'`, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        const user = results.recordsets[0][0];
        db.request().query(`SELECT * FROM movies WHERE movie_id='${req.body.movie_id}'`, (error, results) => {
            if (error) {
                console.error("Error querying database:", error);
                res.status(500).json({ message: "Server error" });
                return;
            }
            const movie = results.recordsets[0][0].movie_title;
            const sqlQuery = 
                `SELECT 
                s.show_time,
                t.theater_name
                FROM 
                    showtimes s
                JOIN 
                    theaters t ON s.theater_id = t.theater_id
                WHERE 
                s.showtime_id = ${req.body.showtime_id}
                AND s.theater_id=${req.body.theater_id}
                AND s.movie_id=${req.body.movie_id};`
            db.request().query(sqlQuery, (error, results) => {
                if (error) {
                    console.error("Error querying database:", error);
                    res.status(500).json({ message: "Server error" });
                    return;
                }
                const theater_name = results.recordsets[0][0].theater_name;
                function convertTimeToLocal(showTime) {
                    const time = new Date(showTime);
                    const hours = time.getUTCHours().toString().padStart(2, '0');
                    const minutes = time.getUTCMinutes().toString().padStart(2, '0');
                    return `${hours}:${minutes}`;
                }
                const show_time = convertTimeToLocal(results.recordsets[0][0].show_time);
                ans.show_time=show_time;
                const seatIDArray = seat_ids.split(',').map(Number);
                const seatID=seatIDArray[0];
                ans.seat_id=seatID;
                const sqlQueryPrice = 
                `   SELECT sp.seat_price_id, sp.price, s.seat_row, s.seat_column
                    FROM seat_prices sp
                    JOIN seats s ON sp.seat_id = s.seat_id
                    WHERE sp.seat_id = ${seatID} AND sp.showtime_id = ${req.body.showtime_id}`;
                db.request().query(sqlQueryPrice, (error, results) => {
                    if (error) {
                        console.error("Error querying database:", error);
                        res.status(500).json({ message: "Server error" });
                        return;
                    }
                    const price = results.recordsets[0][0].price;
                    ans.price=parseInt(price);
                    ans.seat_price_id=parseInt(results.recordsets[0][0].seat_price_id);
                    const seat_name=results.recordsets[0][0].seat_row + results.recordsets[0][0].seat_column.toString();
                    const currentDate = new Date();

                    // Lấy ngày, tháng và năm từ đối tượng Date
                    const day = currentDate.getDate(); // Ngày trong tháng (1-31)
                    const month = currentDate.getMonth() + 1; // Tháng (0-11). Lưu ý: Tháng bắt đầu từ 0 nên cần cộng thêm 1
                    const year = currentDate.getFullYear(); // Năm (4 chữ số)

                    // Định dạng lại ngày, tháng và năm theo định dạng mong muốn
                    const formattedDate = `${day}/${month}/${year}`;
                    ans.theater_id=req.body.theater_id;
                    res.render("client/pages/booking/payment.pug", {
                        pageTitle: "Trang booking",
                        user: user,
                        movie: movie,
                        show_time: show_time,
                        theater_name: theater_name,
                        price: price,
                        seat_name:seat_name,
                        dayPayment:formattedDate,
                        ans:ans
                    });
                    // Xử lý kết quả ở đây
                });
                
            });
        });
    });   
};
module.exports.bookingTicketShow  = (req, res) => {
    const ans=req.body;
    const theater_id=req.body.theater_id;
    const tokenUser=req.cookies.tokenUser;
    const showtime_id=ans.showtime_id;
    const employee_id=ans.employee_id;
    const movie_id=ans.movie_id;
    const seat_id=ans.seat_id;
    const seat_price_id=ans.seat_price_id;
    const payment_method='Credit Card';
    if(tokenUser==undefined){
        req.flash("error", "Vui lòng đăng nhập để tiếp tục");
        res.redirect("/user/login");
        return;
    }
    db.request().query(`SELECT * FROM users WHERE tokenUser='${tokenUser}'`, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        const user=results.recordsets[0][0];
        const user_id=user.user_id;
        const sqlQueryCinema=
        `SELECT c.cinema_address, c.cinema_phone_number
        FROM cinemas c
        JOIN theaters t ON c.cinema_id = t.cinema_id
        WHERE t.theater_id = ${theater_id};`
        db.request().query(sqlQueryCinema, (error, results) => {
            if (error) {
                console.error("Error querying database:", error);
                res.status(500).json({ message: "Server error" });
                return;
            }
            const cinema=results.recordsets[0][0];
            function formatDate(dateString) {
                const date = new Date(dateString);
                const day = date.getDate();
                const month = date.getMonth() + 1; // Lưu ý: tháng bắt đầu từ 0
                const year = date.getFullYear();
            
                // Chuyển đổi các số nguyên thành chuỗi, thêm số 0 vào phía trước nếu cần
                const formattedDay = day < 10 ? '0' + day : day;
                const formattedMonth = month < 10 ? '0' + month : month;
            
                // Trả về chuỗi ngày/tháng/năm đã định dạng
                return formattedDay + '/' + formattedMonth + '/' + year;
            }
            ans.show_date=formatDate(ans.show_date);
           
            const pool = new sql.ConnectionPool(config);
            pool.connect().then(() => {
                
                
                const InsertsqlQuery = `
                    INSERT INTO bookings (showtime_id, user_id, employee_id, movie_id, seat_id, seat_price_id, payment_method)
                    VALUES (@showtime_id, @user_id, @employee_id, @movie_id, @seat_id, @seat_price_id, @payment_method)
                `;

                const request = new sql.Request(pool);
                request.input("showtime_id", sql.BigInt, showtime_id);
                request.input("user_id", sql.BigInt, user_id);
                request.input("employee_id", sql.BigInt, employee_id);
                request.input("movie_id", sql.BigInt, movie_id);
                request.input("seat_id", sql.BigInt, seat_id);
                request.input("seat_price_id", sql.BigInt,seat_price_id);
                request.input("payment_method", sql.NVarChar, payment_method);
                request.query(InsertsqlQuery, (error, results) => {
                    if (error) {
                        console.error("Error inserting data:", error);
                        res.status(500).json({ message: "Server error" });
                        return;
                    }
                    res.render("client/pages/booking/ticketShow.pug",{
                        pageTitle:"Chi tiết vé",
                        user:user,
                        cinema:cinema,
                        ans:ans,
                        success:"Đặt vé thành công"
                    });
                    // Xử lý kết quả nếu cần
                });
               
            }).catch(error => {
                console.error("Connection failed:", error);
            });
           
            // Xử lý kết quả ở đây
        });
       
        
        // Xử lý kết quả ở đây
    });
    

};
