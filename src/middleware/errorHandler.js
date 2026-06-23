// Centralized error handler. Any controller that calls next(error)
// ends up here instead of crashing the server or leaking stack traces to the client.
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later."
  });
};

module.exports = errorHandler;
