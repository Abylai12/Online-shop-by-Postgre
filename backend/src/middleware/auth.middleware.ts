import { NextFunction, Request, Response } from "express";
import { sql } from "../config/connect-to-tb";
import { User } from "../types/types";
import { decodeToken } from "../utils/decode-token";

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
      res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
      return;
    }

    const userId = decodeToken(accessToken);

    const [user] = await sql`SELECT id, name, email, role FROM users WHERE id=${
      userId as string
    } `;

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user as User;

    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(401).json({ error });
  }
};

export const adminRoute = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied - Admin only" });
  }
};
