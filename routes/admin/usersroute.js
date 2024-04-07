const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller.js");
router.get("/", controller.index);
router.get("/:id", controller.getUserById);
module.exports = router;
