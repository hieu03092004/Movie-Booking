module.exports.index  = (req, res) => {
    // no se mac dinh di vao folder views
    res.render("client/pages/moviedetails/index.pug",{
        pageTitle:"Chi tiết phim"
    });
};