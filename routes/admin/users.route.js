const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller.js");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", controller.index);
router.get("/:id", controller.getUserById);
router.post("/add", upload.single("avatar"), controller.createUser);
router.delete("/:id", controller.deleteUser);
router.put("/:id", controller.updateUser);
module.exports = router;
