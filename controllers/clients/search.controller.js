//GEt /search
const db = require("../../config/connect");
module.exports.index=async (req,res) =>{
    const keyword= req.query.keyword;
    if(keyword){
        const sqlQuery = `SELECT * FROM movies WHERE movie_title LIKE '%${keyword}%'`;
        db.request().query(sqlQuery, (error, results) => {
            if (error) {
                console.error("Error querying database:", error);
                res.status(500).json({ message: "Server error" });
                return;
            }
            const movies = results.recordset;
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
            })
            // Truyền dữ liệu admin cho view
            res.render("client/pages/search/index",{
                pageTitle:"Kết quả tìm kiếm",
                keyword:keyword,
                movies:movies,
            });
        });
        
    }
   
}