import ErrorHandler from "../utils/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  //Handle InValid Mongoose ID Error - CAST ERROR
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  //Handle Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((value) => value.message);
    error = new ErrorHandler(message, 400);
  }
  //Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
    error = new ErrorHandler(message, 404);
  }

  //Handle wrong JWT ERROR
  if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }

  //Handle expired JWT ERROR
  if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is expired. Try Again!!!`;
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};

// export default (err, req, res, next) => {
//   let error = { ...err };
//   error.message = err.message;

//   // Invalid MongoDB ObjectId
//   if (err.name === "CastError") {
//     error = new ErrorHandler("Invalid Product ID", 400);
//   }

//   error.statusCode = error.statusCode || 500;

//   if (process.env.NODE_ENV === "DEVELOPMENT") {
//     return res.status(error.statusCode).json({
//       success: false,
//       error: err,
//       message: error.message,
//       stack: err.stack,
//     });
//   }

//   if (process.env.NODE_ENV === "PRODUCTION") {
//     return res.status(error.statusCode).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
