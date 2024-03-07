module.exports.index  = (req, res) => {
    // no se mac dinh di vao folder views
    res.render("client/pages/home/index.pug",{
        pageTitle:"Trang chủ"
    });
};