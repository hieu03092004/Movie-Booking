var sql = require("mssql");

var config = {
  user: "sa",
  password: "Tritt66@gmail",
  server: "localhost", // Tên máy chủ SQL Server
  database: "QLSV", // Tên cơ sở dữ liệu
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

var connection = new sql.ConnectionPool(config);

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected to SQL Server!");
});

module.exports = connection;
