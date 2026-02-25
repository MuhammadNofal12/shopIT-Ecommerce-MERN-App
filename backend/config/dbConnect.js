// import mongoose from "mongoose";

// export const connectDatabase = async () => {
//   try {
//     let DB_URI;
//     const env = process.env.NODE_ENV?.toUpperCase();

//     if (env === "DEVELOPMENT") {
//       DB_URI = process.env.DB_LOCAL_URI;
//     } else if (env === "PRODUCTION") {
//       DB_URI = process.env.DB_URI;
//     }

//     if (!DB_URI) {
//       throw new Error("Database URI is missing. Check env variables.");
//     }

//     const con = await mongoose.connect(DB_URI);
//     console.log(`MongoDB connected with HOST: ${con.connection.host}`);
//   } catch (error) {
//     console.error(`MongoDB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

//----------------------------updated abovee-----------------------
import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    let DB_URI;

    const env = process.env.NODE_ENV;

    if (env === "development") {
      DB_URI = process.env.DB_LOCAL_URI;
    } else {
      // production or anything else
      DB_URI = process.env.DB_URI;
    }

    if (!DB_URI) {
      throw new Error("Database URI is missing. Check env variables.");
    }

    const con = await mongoose.connect(DB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 30000,
    });

    console.log(`MongoDB connected with HOST: ${con.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
// import mongoose from "mongoose";

// export const connectDatabase = async () => {
//   const env = process.env.NODE_ENV?.toLowerCase();

//   const DB_URI =
//     env === "production" ? process.env.DB_URI : process.env.DB_LOCAL_URI;

//   if (!DB_URI) {
//     console.error("❌ MongoDB connection string is missing");
//     process.exit(1);
//   }

//   const con = await mongoose.connect(DB_URI);

//   console.log(`MongoDB Database connected with HOST: ${con.connection.host}`);
// };
