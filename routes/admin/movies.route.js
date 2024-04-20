const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/movies.controller.js");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/movies");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", controller.index);
router.get("/:id", controller.getMovieById);
router.post("/add", upload.single("movie_image"), controller.create);
router.delete("/:id", controller.delete);
router.put("/:id", controller.update);

module.exports = router;
