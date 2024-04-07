var sql = require("mssql");

var config = {
  user: "sa",
  password: "03092004",
  server: "localhost", // Tên máy chủ SQL Server
  database: "ApolloCinema", // Tên cơ sở dữ liệu
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

  
