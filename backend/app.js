// import express from "express";
// const app = express();
// import dotenv from "dotenv";
// import { connectDatabase } from "./config/dbConnect.js";
// import errorMiddleware from "./middlewares/errors.js";

// //Handle Uncaught Exception
// process.on("uncaughtException", (err) => {
//   console.log(`ERROR: ${err}`);
//   console.log("Shutting down due to uncaught exception");
//   process.exit(1);
// });

// dotenv.config({ path: "backend/config/config.env" });

// //connecting to database
// connectDatabase();

// app.use(express.json());

// //Import all routes
// import productRoutes from "./routes/products.js";

// app.use("/api/v1", productRoutes);

// //using error middleWare
// app.use(errorMiddleware);

// const server = app.listen(process.env.PORT, () => {
//   console.log(
//     `Server started on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
//   );
// });

// //Handle unhandled Promise rejections
// process.on("unhandledRejection", (err) => {
//   console.log(`ERROR: ${err}`);
//   console.log("Shutting down server due to Unhandled Promise Rejection");
//   server.close(() => {
//     process.exit(1);
//   });
// });

//-------------------------------------------------------------------------
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";

import { stripeWebhook } from "./controllers/paymentControllers.js";

import bodyParser from "body-parser";

// --------------------
// Load Environment Variables (ALWAYS LOAD)
// --------------------
dotenv.config();

// --------------------
// Handle Uncaught Exceptions
// --------------------
process.on("uncaughtException", (err) => {
  console.error(`UNCAUGHT EXCEPTION: ${err.message}`);
  process.exit(1);
});

// --------------------
// Initialize App
// --------------------
const app = express();

app.set("trust proxy", 1);
app.set("query parser", "extended");

// --------------------
// Connect Database
// --------------------
console.log("DB_URI:", process.env.DB_URI);
connectDatabase();

// --------------------
// CORS Configuration
// --------------------
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.options("*", cors());

// --------------------
// Stripe Webhook (RAW body required BEFORE express.json())
// --------------------
// app.use(
//   "/api/v1/payment/webhook",
//   express.raw({ type: "application/json" }),
//   paymentRoutes, // <-- make sure paymentRoutes has .post("/payment/webhook", ...)
// );

// app.post(
//   "/api/v1/payment/webhook",
//   express.raw({ type: "application/json" }),
//   stripeWebhook,
// );

// Stripe requires raw body for webhook
app.post(
  "/api/v1/payment/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook,
);

// --------------------
// Body Parsers
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --------------------
// Routes
// --------------------

app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);

app.use("/api/v1", paymentRoutes);

// --------------------
// Serve Frontend (Optional - if hosting backend + frontend together)
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// --------------------
// Error Middleware (MUST BE LAST)
// --------------------
app.use(errorMiddleware);

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// --------------------
// Handle Unhandled Promise Rejections
// --------------------
process.on("unhandledRejection", (err) => {
  console.error(`UNHANDLED REJECTION: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
