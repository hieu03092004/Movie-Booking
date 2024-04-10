const productColumns = require("../../data/productColumns.js");
const db = require("../../config/connect.js");

module.exports.index = (req, res) => {
  // let openAddButton = false;

  const query =
    "SELECT movie_id, release_date,  movie_title, director,genre,movie_language,age_limit FROM movies";

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    const movies = results.recordset.map((item) => {
      const duration = new Date(item.movie_duration);
      const hours = duration.getUTCHours();
      const minutes = duration.getUTCMinutes();
      const seconds = duration.getUTCSeconds();
      item.movie_duration = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      const releaseDate = new Date(item.release_date);
      const year = releaseDate.getFullYear();
      const month = (releaseDate.getMonth() + 1).toString().padStart(2, "0");
      const day = releaseDate.getDate().toString().padStart(2, "0");
      item.release_date = `${day}-${month}-${year}`;
      return item;
    });

    res.render("admin/pages/movies/index.pug", {
      pageTitle: "Danh sách phim",
      // openAddButton,
      productColumns,
      movies,
      slug: "movies",
    });
  });
};

module.exports.getMovieById = (req, res) => {
  const movieId = req.params.id;

  const query = `SELECT * FROM movies WHERE movie_id = ${movieId}`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }

    const movie = results.recordset[0];

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    const duration = new Date(movie.movie_duration);
    const hours = duration.getUTCHours();
    const minutes = duration.getUTCMinutes();
    const seconds = duration.getUTCSeconds();
    movie.movie_duration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    const releaseDate = new Date(movie.release_date);
    const year = releaseDate.getFullYear();
    const month = (releaseDate.getMonth() + 1).toString().padStart(2, "0");
    const day = releaseDate.getDate().toString().padStart(2, "0");
    movie.release_date = `${day}-${month}-${year}`;

    // console.log(movie);

    res.render("admin/pages/movies/detailMovie.pug", {
      pageTitle: `Movie ${movie.movie_id}`,
      productColumns,
      movie,
      slug: "movies",
    });
  });
};

module.exports.create = (req, res) => {
  const {
    movie_title,
    director,
    genre,
    movie_duration,
    movie_language,
    movie_image,
    movie_desc,
    movie_trailer,
    age_limit,
    status_name,
    release_date,
  } = req.body;

  const query = `INSERT INTO movies (movie_title, director, genre, movie_duration, movie_language, movie_image, movie_desc, movie_trailer, age_limit, status_name, release_date) VALUES (N'${movie_title}', N'${director}', N'${genre}', '${movie_duration}', N'${movie_language}', '${movie_image}', N'${movie_desc}', '${movie_trailer}', N'${age_limit}', N'${status_name}', '${release_date}')`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(200).json({ message: "Movie added successfully" });
  });
};

module.exports.delete = (req, res) => {
  const movieId = req.params.id;

  const query = `DELETE FROM movies WHERE movie_id = ${movieId}`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie deleted successfully" });
  });
};

module.exports.update = (req, res) => {
  const movieId = req.params.id;
  const {
    movie_title,
    director,
    genre,
    movie_duration,
    movie_language,
    movie_image,
    movie_desc,
    movie_trailer,
    age_limit,
    status_name,
    release_date,
  } = req.body;

  console.log(
    movie_title,
    movieId,
    director,
    genre,
    movie_duration,
    movie_language,
    movie_image,
    movie_desc,
    movie_trailer,
    age_limit,
    status_name,
    release_date
  );

  const query = `UPDATE movies SET movie_title = N'${movie_title}', director = N'${director}', genre = N'${genre}', movie_duration = '${movie_duration}', movie_language = N'${movie_language}', movie_image = '${movie_image}', movie_desc = N'${movie_desc}', movie_trailer = '${movie_trailer}', age_limit = N'${age_limit}', status_name = N'${status_name}', release_date = '${release_date}' WHERE movie_id = ${movieId}`;

  db.request().query(query, (error, results) => {
    if (error) {
      console.error("Error querying database:", error);
      return res.status(500).json({ message: "Server error" });
    }
    if (results.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.status(200).json({ message: "Movie updated successfully" });
  });
};
