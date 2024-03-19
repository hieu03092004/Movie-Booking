const topDealUsers = require("../../data/topDealUsers");
const chartBoxUser = require("../../data/chartBoxUser.js");
const chartBoxProduct = require("../../data/chartBoxProduct.js");
const chartBoxConversion = require("../../data/chartBoxConversion.js");
const chartBoxRevenue = require("../../data/chartBoxRevenue.js");
const pieChartBox = require("../../data/pieChartBox.js");
const bigChartBox = require("../../data/bigChartBox.js");
const barChartBoxRevenue = require("../../data/barChartBoxRevenue.js");
const barChartBoxVisit = require("../../data/barChartBoxVisit.js");

module.exports.index = (req, res) => {
    res.render("admin/pages/home/index.pug", {
        pageTitle: "Trang chủ",
        topDealUsers,
        chartBoxUser,
        chartBoxProduct,
        chartBoxConversion,
        chartBoxRevenue,
        pieChartBox,
        bigChartBox,
        barChartBoxRevenue,
        barChartBoxVisit,
    });
};
