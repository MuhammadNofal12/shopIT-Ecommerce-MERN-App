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
// utils/sendToken.js
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    secure: true,
    sameSite: "none",
    path: "/", // required for logout
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    token,
  });
};

export default sendToken;
