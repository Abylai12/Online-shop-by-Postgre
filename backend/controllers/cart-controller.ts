import { Request, Response } from "express";
import { sql } from "../config/connect-to-tb";

export const getCartProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;
    const products =
      await sql`SELECT p.name, p.id AS productId, p.description, p.images, p.price, uc.quantity, uc.id, uc.added_at
FROM user_carts uc
JOIN products p ON uc.product_id = p.id
WHERE uc.user_id = ${id}
ORDER BY uc.added_at DESC;
`;
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const { id } = req.user;

    const [existProduct] =
      await sql`SELECT * FROM user_carts WHERE user_id = ${id} AND product_id = ${productId}`;

    if (existProduct) {
      res.status(400).json({ message: "Product already exists in your cart" });
      return;
    }

    const product =
      await sql`INSERT INTO user_carts (user_id, product_id, quantity) VALUES (${id}, ${productId}, ${quantity})`;

    res.status(200).json({ message: "Product added to cart", product });
  } catch (error) {
    console.log("Error in addToCart controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;
    const deletedCart = await sql`DELETE FROM user_carts WHERE id=${cartId}`;
    res
      .status(200)
      .json({ message: "Product deleted successfully", deletedCart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateQuantity = async (req: Request, res: Response) => {
  try {
    const { quantity, cartId } = req.body;

    const updateCart =
      await sql`UPDATE user_carts SET quantity = ${quantity} WHERE id = ${cartId}`;

    res
      .status(200)
      .json({ message: "Product updated successfully", updateCart });
  } catch (error) {
    console.log("Error in updateQuantity controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};
