import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connect-to-tb";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth-route";
import cartRoutes from "./routes/cart-route";
import couponRoutes from "./routes/coupon-route";
import paymentRoutes from "./routes/payment-route";
import productRoutes from "./routes/product-route";
import categoryRoutes from "./routes/category-route";

dotenv.config();

const PORT = process.env.PORT || "";

const app = express();

const corsOptions = {
  origin: `${process.env.CLIENT_URL}`, // Allow requests only from your frontend
  credentials: true, // Allow credentials (cookies or authorization tokens)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.get("/", async (_: Request, res: Response) => {
  res.send("Welcome E-commerce API Server");
});

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/coupons", couponRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/category", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Сервер localhost:${PORT} дээр аслаа`);
});
