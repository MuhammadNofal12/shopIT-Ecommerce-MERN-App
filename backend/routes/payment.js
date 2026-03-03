import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
} from "../controllers/paymentControllers.js";
const router = express.Router();

//get user profile
// router
//   .route("/payment/checkout_session")
//   .post(isAuthenticatedUser, stripeCheckoutSession);

// router.route("/payment/webhook").post(stripeWebhook);

router.post(
  "/payment/checkout_session",
  isAuthenticatedUser,
  stripeCheckoutSession,
);
// router.post(
//   "/payment/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook,
// );
router.post("/payment/webhook", stripeWebhook);

export default router;
