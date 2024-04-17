const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/tickets.controller.js");
router.get("/", controller.index);
module.exports = router;
