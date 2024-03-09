module.exports.index  = (req, res) => {
    // no se mac dinh di vao folder views
    res.render("client/pages/about/index.pug",{
        pageTitle:"Trang about us"
    });
};