import { Request, Response } from "express";
import { sql } from "../config/connect-to-tb";
import bcrypt from "bcrypt";
import {
  generateTokens,
  setCookies,
  storeRefreshToken,
} from "../utils/generate-tokens";
import { redis } from "../config/redis";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const [user] = await sql`SELECT * FROM users WHERE email=${email}`;
    if (!user) {
      res.status(404).json({ message: "Not found user" });
    } else {
      const isCheck = bcrypt.compareSync(password, user.password);
      if (!isCheck) {
        res.status(400).json({ message: "Not match user email or password" });
      } else {
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        res.status(200).json({
          message: "success",
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
export const signup = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;
  try {
    const userExist = await sql`SELECT * FROM users WHERE email=${email}`;
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const [newUser] = await sql`
    INSERT INTO users (email, name, password)
    VALUES (${email}, ${name}, ${hashedPassword})
    RETURNING id, email, name, role
  `;
    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(401).json({ error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const userId = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || ""
      );
      await redis.del(`refresh_token:${userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const userId = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || ""
    );
    const storedToken = await redis.get(`refresh_token:${userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId },
      process.env.ACCESS_TOKEN_SECRET || "",
      { expiresIn: "15m" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getProfile = async (req: Request, res: Response) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
