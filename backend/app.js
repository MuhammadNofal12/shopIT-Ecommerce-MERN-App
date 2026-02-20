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
// import express from "express";
// import dotenv from "dotenv";
// import { connectDatabase } from "./config/dbConnect.js";
// import errorMiddleware from "./middlewares/errors.js";
// import productRoutes from "./routes/products.js";
// import authRoutes from "./routes/auth.js";
// import orderRoutes from "./routes/order.js";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import paymentRoutes from "./routes/payment.js";

// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// //const app = express();
// //app.set("query parser", "extended");

// // Handle uncaught exceptions
// process.on("uncaughtException", (err) => {
//   console.log(`ERROR: ${err.message}`);
//   process.exit(1);
// });

// // Load env vars
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config({ path: "backend/config/config.env" });
// }

// const app = express();

// app.set("query parser", "extended");
// // Connect to DB
// connectDatabase();

// // ✅ CORS setup for both local and production frontend
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://shopit-frontend-qybleltkg-muhammadnofal12s-projects.vercel.app",
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true, // needed to send cookies
//   }),
// );

// // app.use(
// //   cors({
// //     origin: process.env.FRONTEND_URL,
// //     credentials: true,
// //   }),
// // );

// // Middleware
// // app.use(
// //   express.json({
// //     limit: "10mb",
// //     verify: (req, res, buf) => {
// //       req.rawBody = buf.toString();
// //     },
// //   }),
// // );
// app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));
// app.use(express.json({ limit: "10mb" }));

// app.use(express.urlencoded({ extended: true }));

// app.use(cookieParser());

// // Routes
// app.use("/api/v1", productRoutes);
// app.use("/api/v1", authRoutes);
// app.use("/api/v1", orderRoutes);
// app.use("/api/v1", paymentRoutes);

// //connecting backend to frontend
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));

//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
//   });
// }
// // Error middleware (ALWAYS last)
// app.use(errorMiddleware);

// // Start server
// const server = app.listen(process.env.PORT, () => {
//   console.log(
//     `Server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`,
//   );
// });

// // Unhandled promise rejections
// process.on("unhandledRejection", (err) => {
//   console.log(`ERROR: ${err.message}`);
//   server.close(() => process.exit(1));
// });

///----------------------------------------------------------------------------
import express from "express";
import dotenv from "dotenv";
import { connectDatabase } from "./config/dbConnect.js";
import errorMiddleware from "./middlewares/errors.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import orderRoutes from "./routes/order.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  process.exit(1);
});

// Load env vars for dev
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "backend/config/config.env" });
}

const app = express();
app.set("query parser", "extended");

// Connect DB
connectDatabase();

// ✅ CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://shopit-frontend-qybleltkg-muhammadnofal12s-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Middleware
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1", paymentRoutes);

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

// Error middleware (ALWAYS last)
app.use(errorMiddleware);

// Start server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  server.close(() => process.exit(1));
});
