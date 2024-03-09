module.exports.index  = (req, res) => {
    // no se mac dinh di vao folder views
    res.render("client/pages/feedback/index.pug",{
        pageTitle:"Trang phản hồi"
    });
};