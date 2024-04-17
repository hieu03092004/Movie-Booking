const db = require("../../config/connect");
module.exports.index  = (req, res) => {
   // Số mục cần bỏ qua
    const sqlQuery = `SELECT COUNT(*) AS totalMovies FROM movies`;
    let totalMovies=0;
    db.request().query(sqlQuery, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
         totalMovies =results.recordsets[0][0]. totalMovies;
         let pagination={
          currentPage:1,
          limitItems:8
        }
        const totalPage= Math.ceil(totalMovies/ pagination.limitItems);
        pagination.totalPage=totalPage;
        if(req.query.page){
          pagination.currentPage=parseInt(req.query.page);
        }
        pagination.skip= (pagination.currentPage-1)*pagination.limitItems;
        const query = `SELECT TOP ${pagination.limitItems} *
        FROM (
            SELECT *, ROW_NUMBER() OVER (ORDER BY movie_id) AS row
            FROM movies
        ) AS movieWithRowNumber
        WHERE row > ${pagination.skip}`;
        db.request().query( query, (error, results) => {
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
  
          res.render("client/pages/home/index.pug",{
              pageTitle:"Trang chủ",
              movies:movies,
              pagination:pagination
          });
        });
    });   
};
