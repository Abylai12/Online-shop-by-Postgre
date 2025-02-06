import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Response } from "express";
import { redis } from "../config/redis";

dotenv.config();

export const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET || "",
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET || "",
    {
      expiresIn: "7d",
    }
  );

  return { accessToken, refreshToken };
};

export const storeRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); // 7days
};

// export const setCookies = (
//   res: Response,
//   accessToken: string,
//   refreshToken: string
// ) => {
//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//     maxAge: 15 * 60 * 1000,
//     domain: "localhost", // Explicitly set domain
//     path: "/", // Explicitly set path
//   });
//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: false,
//     sameSite: "lax",
//     maxAge: 7 * 24 * 60 * 60 * 1000,
//     domain: "localhost", // Explicitly set domain
//     path: "/", // Explicitly set path
//   });
// };

export const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // prevent XSS attacks, cross site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // prevents CSRF attack, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
