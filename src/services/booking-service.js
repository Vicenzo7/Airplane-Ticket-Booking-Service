const axios = require("axios");
const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH } = require("../config/serverConfig");
const { ServiceError, AppError } = require("../utils/errors");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightId = data.flightId;
      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

      const response = await axios.get(getFlightRequestURL);
      const flightData = response.data.data;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError(
          "Something went wrong",
          "Insufficient seats for booking"
        );
      }

      const priceOfTheFlight = flightData.price;
      const totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost };
      const booking = await this.bookingRepository.create(bookingPayload);
      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;

      axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats - booking.noOfSeats,
      });
      const finalBooking = await this.bookingRepository.update(booking.id, {
        status: "Booked",
      });
      return finalBooking;
    } catch (error) {
      if (
        error.name === "RepositoryError" ||
        error.name === "ValidationError"
      ) {
        throw error;
      }
      throw new ServiceError();
    }
  }

  async updateBooking(bookingId) {
    try {
      const booking = await this.bookingRepository.getBooking(bookingId);

      if (!booking) {
        throw new AppError(
          "Booking Not Found",
          "Invalid bookingId in the request",
          "Please check bookingId, as there is no record of such bookingId",
          StatusCodes.NOT_FOUND
        );
      }

      const flightId = booking.flightId;

      const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

      const response = await axios.get(getFlightRequestURL);
      const flightData = response.data.data;

      const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

      axios.patch(updateFlightRequestURL, {
        totalSeats: flightData.totalSeats + booking.noOfSeats,
      });

      const updatedBooking = await this.bookingRepository.update(booking.id, {
        status: "Canceled",
      });

      return updatedBooking;
    } catch (error) {
      console.log(error);
      if (
        error.name === "RepositoryError" ||
        error.name === "ValidationError"
      ) {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
