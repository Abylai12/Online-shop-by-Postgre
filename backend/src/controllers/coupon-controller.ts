import { Request, Response } from "express";
import { sql } from "../config/connect-to-tb";

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const [coupon] =
      await sql`SELECT * FROM coupons WHERE user_id=${id} AND isActive=${true}`;
    res.status(200).json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const validateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const { id } = req.user;

    const [coupon] =
      await sql`SELECT * FROM coupons WHERE user_id=${id} AND code =${code}`;
    if (!coupon) {
      res.status(201).json({ message: "Coupon not found" });
      return;
    }

    if (coupon.valid_until < new Date()) {
      await sql`UPDATE coupons SET isActive=${false} WHERE user_id=${id} `;
      res.status(202).json({ message: "Coupon expired" });
      return;
    }
    await sql`UPDATE coupons SET isActive=${true} WHERE user_id=${id}  AND code =${code} `;

    res.status(200).json(coupon);
  } catch (error) {
    console.log("Error in validateCoupon controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const unValidateCoupon = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const { id } = req.user;

    await sql`UPDATE coupons SET isActive=${false} WHERE user_id=${id} AND code =${code} `;

    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log("Error in validateCoupon controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};
