const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller.js");
router.get("/", controller.index);
router.get("/:id", controller.getUserById);
router.post("/add", controller.createUser);
router.delete("/:id", controller.deleteUser);
router.put("/:id", controller.updateUser);
module.exports = router;
