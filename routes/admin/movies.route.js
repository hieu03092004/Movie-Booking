const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/movies.controller.js");

router.get("/", controller.index);
router.get("/:id", controller.getMovieById);
router.post("/add", controller.create);
router.delete("/:id", controller.delete);
router.put("/:id", controller.update);

module.exports = router;
