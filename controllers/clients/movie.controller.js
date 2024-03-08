const db = require("../../config/connect");

module.exports.index = (req, res) => {
  db.request().query("SELECT * FROM SINHVIEN", (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      res.status(500).json({ message: "Server error" });
      return;
    }
    console.log(results);
    res.render("client/pages/movies/index.pug", {
      pageTitle: "Danh sách các phim",
      admin: results.recordset, // Truyền dữ liệu admin cho view
    });
  });
};
