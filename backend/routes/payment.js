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
import {
  //  getOrderFromSession,
  stripeCheckoutSession,
  // stripeWebhook,
} from "../controllers/paymentControllers.js";

const router = express.Router();

// Create checkout session
router.post(
  "/payment/checkout_session",
  isAuthenticatedUser,
  stripeCheckoutSession,
);

// Stripe webhook (MUST use raw body)
// router.post(
//   "/payment/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook,
// );

//router.post("/payment/webhook", stripeWebhook);

// Get order using session id
// router.get(
//   "/payment/order-from-session/:sessionId",
//   isAuthenticatedUser,
//   getOrderFromSession,
// );

export default router;
