const userRows = require("../../data/userRows.js");
const userColumns = require("../../data/userColumns.js");
const singleUser = require("../../data/singleUser.js");

module.exports.index = (req, res) => {
    let openAddButton = false;

    res.render("admin/pages/users/index.pug", {
        pageTitle: "Người dùng",
        openAddButton,
        userColumns,
        userRows,
        slug: "users",
    });
};

module.exports.getUserById = (req, res) => {
    // const userId = req.params.id;
    // //sau này sửa chỗ này ===
    // const user = singleUser.id;
    // if (!user) {
    //     return res.status(404).send("User not found");
    // }
    // console.log(user);
    res.render("admin/pages/users/detailUser.pug", {
        // pageTitle: `User ${user.id}`,
        pageTitle: `User 1`,
        // user,
        singleUser,
    });
};
