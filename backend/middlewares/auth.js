// import ErrorHandler from "../utils/errorHandler.js";
// import catchAsyncErrors from "./catchAsyncErrors.js";
// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// //chks if user is authenticated or not
// export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHandler("Login first to access this resource", 401));
//   }

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   // console.log(decoded);
//   req.user = await User.findById(decoded.id);

//   next();
// });

// //Authorize user roles
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new ErrorHandler(
//           `Role (${req.user.role}) is not allowed to access this resource`,
//           403,
//         ),
//       );
//     }
//     next();
//   };
// };

//Logout user=> /api/v1/logout
// export const logout = catchAsyncErrors(async (req, res, next) => {
//   res.cookie("token", null, {
//     expires: new Date(Date.now()),
//     httpOnly: true,
//   });
//   res.status(200).json({ message: "Logged Out!!!" });
// });

//------------------------------------------------------------------
// middlewares/auth.js
import jwt from "jsonwebtoken";
import catchAsyncErrors from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../models/user.js";

// Check if user is authenticated
export const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Login first to access this resource", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return next(new ErrorHandler("User not found", 401));
    }
    next();
  } catch (err) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

// Role-based authorization
export const authorizeRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403,
        ),
      );
    }
    next();
  };
