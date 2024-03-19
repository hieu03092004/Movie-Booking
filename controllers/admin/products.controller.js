const productColumns = require("../../data/productColumns.js");
const ProductRows = require("../../data/products.js");

module.exports.index = (req, res) => {
    let openAddButton = false;

    res.render("admin/pages/products/index.pug", {
        pageTitle: "Sản phẩm",
        openAddButton,
        productColumns,
        ProductRows,
        slug: "products",
    });
};
