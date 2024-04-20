const express = require("express");
const router =express.Router();
const controller=require("../../controllers/clients/booking.controller.js");
router.get("/showtime/:showdate/:showtime/:id", controller.booking);
router.post("/payment/:id", controller.bookingPayment);
router.post("/ticketShow/:id", controller.bookingTicketShow);
module.exports=router;