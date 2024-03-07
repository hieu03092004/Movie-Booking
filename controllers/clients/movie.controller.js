const db=require("../../config/connect");
module.exports.index= (req, res) => {
    db.query(`SELECT * FROM admin`, (error, results) => {
        if (error) {
            console.error("Error querying database:", error);
            res.status(500).json({ message: "Server error" });
            return;
        }
        console.log(results[0].password); // Xác nhận xem dữ liệu đã được trả về hay không
        res.render("client/pages/movies/index.pug", {
            pageTitle: "Danh sách các phim",
            admin: results // Truyền dữ liệu admin cho view
        });
    });
};