const express = require("express");
const router =express.Router();
const controller=require("../../controllers/clients/moviedetails.controllers.js");
router.get("/", controller.index);
module.exports=router;