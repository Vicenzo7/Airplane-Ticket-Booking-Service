const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services/index");

const bookingService = new BookingService();

const create = async (req, res) => {
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
};

const update = async (req, res) => {
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
};

module.exports = {
  create,
  update,
};
