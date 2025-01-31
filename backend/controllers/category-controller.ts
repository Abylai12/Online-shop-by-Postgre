import { Request, Response } from "express";
import { sql } from "../config/connect-to-tb";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, parent_id } = req.body;

    const query = parent_id
      ? sql`INSERT INTO categories (name, description, parent_id) VALUES (${name}, ${description}, ${parent_id}) RETURNING id, name`
      : sql`INSERT INTO categories (name, description) VALUES (${name}, ${description}) RETURNING id, name`;

    const category = await query;
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCategories = async (_: Request, res: Response) => {
  try {
    const categories =
      await sql`SELECT * FROM categories WHERE parent_id IS NOT NULL`;
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
