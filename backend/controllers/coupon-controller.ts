import { Request, Response } from "express";
import { sql } from "../config/connect-to-tb";

export const getCoupon = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const coupon =
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
      await sql`SELECT * FROM coupons WHERE user_id=${id} AND isActive=${true} AND code =${code}`;
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    if (coupon.valid_until < new Date()) {
      await sql`UPDATE coupons SET isActive=${false} WHERE user_id=${id} `;
      throw new Error("Coupon expired");
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discount_percentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};
