import { Request, Response } from "express";
import { sql } from "../config/connect-to-tb";

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const { id } = req.user;

    const [existProduct] =
      await sql`SELECT * FROM user_wishlist WHERE user_id = ${id} AND product_id = ${productId}`;

    if (existProduct) {
      await sql`DELETE FROM user_wishlist WHERE user_id = ${id} AND product_id = ${productId}`;
      res.status(200).json({ message: "Product removed from  list" });
      return;
    }

    await sql`INSERT INTO user_wishlist (user_id, product_id) VALUES (${id}, ${productId})`;

    res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.log("Error in addToWishlist controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};
