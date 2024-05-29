const express = require("express");
const router =express.Router();
const controller=require("../../controllers/clients/booking.controller.js");
router.get("/showtime/theater/:showtime_id/:theater_id", controller.booking);
router.post("/payment", controller.bookingPayment);
router.post("/ticketShow", controller.bookingTicketShow);
module.exports=router;