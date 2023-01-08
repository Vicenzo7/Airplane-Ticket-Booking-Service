const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");

const { createChannel, publishMessage } = require("../utils/messageQueue");
const { REMINDER_BINDING_KEY } = require("../config/serverConfig");

const bookingService = new BookingService();

class BookingController {
  constructor() {}

  async sendMessageToQueue(req, res) {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "This is a noti from queue",
        content: "Some queue will subscribe it",
        recipientEmail: "deeprajm35@gmail.com",
        notificationTime: "2023-01-08 18:17:10",
      },
      service: "CREATE_TICKET",
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(StatusCodes.OK).json({
      message: "Successfully published the event",
    });
  }

  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      return res.status(StatusCodes.OK).json({
        data: response,
        success: true,
        message: "Successfully completed booking",
        err: {},
      });
    } catch (error) {
      console.log(error);
      res.status(error.statusCodes).json({
        data: {},
        success: false,
        message: error.message,
        err: error.explanation,
      });
    }
  }

  async update(req, res) {
    try {
      const response = await bookingService.updateBooking(req.params.id);
      return res.status(StatusCodes.OK).json({
        data: response,
        success: true,
        message: "Successfully cancelled the booking",
        err: {},
      });
    } catch (error) {
      console.log(error);
      res.status(error.statusCodes).json({
        data: {},
        success: false,
        message: error.message,
        err: error.explanation,
      });
    }
  }
}

module.exports = BookingController;
