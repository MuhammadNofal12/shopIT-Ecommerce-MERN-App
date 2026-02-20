// import mongoose from "mongoose";
// import products from "./data.js";
// import Product from "../models/product.js";
// const seedProducts = async () => {
//   try {
//     await mongoose.connect(
//       "mongodb+srv://muhammadnofal446_db_user:12345@cluster0.kynigtm.mongodb.net/shopIT"
//     );

//     await Product.deleteMany();
//     console.log("Products are deleted!!!");

//     await Product.insertMany(products);
//     console.log("Products are added!!!");

//     process.exit();
//   } catch (error) {
//     console.log(error.message);
//     process.exit();
//   }
// };

// seedProducts();

///---------------------seeder
import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./data.js";
import Product from "../models/product.js";
import User from "../models/user.js";

dotenv.config({ path: "backend/config/config.env" });

const seedProducts = async () => {
  try {
    // Connect DB
    await mongoose.connect(process.env.DB_LOCAL_URI);

    console.log("MongoDB connected for seeding...");

    // Delete old products
    await Product.deleteMany();
    console.log("Products are deleted!!!");

    // Get admin user
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
      throw new Error("Admin user not found. Create admin first.");
    }

    // Attach user to each product
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser._id,
    }));

    // Insert
    await Product.insertMany(sampleProducts);
    console.log("Products are added successfully!!!");

    process.exit();
  } catch (error) {
    console.error("Seeder Error:", error.message);
    process.exit(1);
  }
};

seedProducts();
