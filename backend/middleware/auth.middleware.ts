import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { sql } from "../config/connect-to-tb";
import { User } from "../types/user-type";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    try {
      const userId = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET || ""
      );
      const [user] = await sql`SELECT name, email, role FROM users WHERE id=${
        userId as string
      } `;

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user as User;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized - Invalid access token" });
  }
};

export const adminRoute = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};
