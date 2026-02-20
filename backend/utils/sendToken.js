// //Create token and save in cookie
// export default (user, statusCode, res) => {
//   //Create jwt token
//   const token = user.getJwtToken();

//   //option for cookies
//   const options = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000,
//     ),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "PRODUCTION", // HTTPS only in production
//     sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax", // cross-origin cookie
//   };

//   console.log(options);
//   res.status(statusCode).cookie("token", token, options).json({
//     token,
//   });
// };

//Create token and save in cookie
export default (user, statusCode, res) => {
  const token = user.getJwtToken();

  const isProduction = process.env.NODE_ENV === "production"; // ✅ lowercase

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: isProduction, // ✅ correct
    sameSite: isProduction ? "none" : "lax", // ✅ correct
  };

  res.status(statusCode).cookie("token", token, options).json({
    token,
  });
};
