import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connect-to-tb";
import { connectRedis } from "./config/redis";
import { connectStripe } from "./config/stripe";

dotenv.config();

const PORT = process.env.PORT || "";
const RedisUri = process.env.UPSTASH_REDIS_URL || "";
const secretKey = process.env.STRIPE_SECRET_KEY || "";

const app = express();
app.use(express.json());

app.get("/", async (_: Request, res: Response) => {
  res.send("Welcome E-commerce API Server");
});

connectDB();
connectRedis(RedisUri);
connectStripe(secretKey);

app.listen(PORT, () => {
  console.log(`Сервер localhost:${PORT} дээр аслаа`);
});
