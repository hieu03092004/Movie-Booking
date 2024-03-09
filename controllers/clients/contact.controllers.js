module.exports.index  = (req, res) => {
    // no se mac dinh di vao folder views
    res.render("client/pages/contact/index.pug",{
        pageTitle:"Trang liên hệ"
    });
};