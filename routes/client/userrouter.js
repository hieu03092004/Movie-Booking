const express = require("express");
const router = express.Router();
const controller = require("../../controllers/clients/user.controller.js");
const validate = require("../../validates/client/user.validate.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/register", controller.register);
router.post(
  "/register",
  upload.single("avatar"),
  validate.registerPost,
  controller.registerPost
);
router.get("/login", controller.login);
router.post("/login", validate.loginPost, controller.loginPost);
router.get("/password/forgot", controller.forgotPassword);
router.post(
  "/password/forgot",
  validate.forgotPasswordPost,
  controller.forgotPasswordPost
);
router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  validate.resetPasswordPost,
  controller.resetPasswordPost
);
router.get("/logout", controller.logout);
module.exports = router;
