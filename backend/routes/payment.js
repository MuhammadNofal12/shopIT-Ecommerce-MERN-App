// import express from "express";
// import { isAuthenticatedUser } from "../middlewares/auth.js";
// import {
//   stripeCheckoutSession,
//   stripeWebhook,
// } from "../controllers/paymentControllers.js";
// const router = express.Router();

// //get user profile
// // router
// //   .route("/payment/checkout_session")
// //   .post(isAuthenticatedUser, stripeCheckoutSession);

// // router.route("/payment/webhook").post(stripeWebhook);

// router.post(
//   "/payment/checkout_session",
//   isAuthenticatedUser,
//   stripeCheckoutSession,
// );
// router.post(
//   "/payment/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook,
// );

// export default router;

//-------------------------------------------------updated----------------------------
// routes/payment.js
import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { stripeCheckoutSession } from "../controllers/paymentControllers.js";

const router = express.Router();

// Define the route for creating Stripe checkout session
router.post(
  "/payment/checkout_session",
  isAuthenticatedUser,
  stripeCheckoutSession,
);

export default router;
