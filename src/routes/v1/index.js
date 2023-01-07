const express = require("express");

const { BookingController } = require("../../controllers/index");
// const { createChannel } = require("../../utils/messageQueue");

// const channel =  createChannel();
const bookingController = new BookingController();
const router = express.Router();

router.post("/bookings", bookingController.create);
router.post("/publish", bookingController.sendMessageToQueue);
router.patch("/bookings/:id", bookingController.update);

module.exports = router;
