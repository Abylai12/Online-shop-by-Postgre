import { redis } from "../config/redis";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { sql } from "../config/connect-to-tb";

export const getCurrentProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [product] = await sql`
    SELECT 
      p.id,
      p.name,
      p.description,
      p.stock_quantity AS total_stock_quantity,
      p.price,
      p.images,
      c.name AS category_name,
      ARRAY_AGG(
        JSON_BUILD_OBJECT('size', ps.size, 'stock_quantity', ps.stock_quantity)
      ) AS product_sizes,
      d.discount_percentage AS product_discount,
      qd.min_quantity AS quantity_discount
    FROM 
      products p
    LEFT JOIN 
      categories c ON p.category_id = c.id
    LEFT JOIN 
      product_sizes ps ON p.id = ps.product_id
    LEFT JOIN 
      product_discounts d ON p.id = d.product_id
    LEFT JOIN 
      quantity_discounts qd ON p.id = qd.product_id
    WHERE 
      p.id = ${id}
    GROUP BY 
      p.id, c.name, d.discount_percentage, qd.min_quantity;
  `;

    res.status(200).json({ message: "success", product });
  } catch (error) {
    console.error(error);
  }
};

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await sql`
      SELECT
        p.id,
        p.name AS product_name,
        p.description,
        p.stock_quantity,
        p.price,
        p.images,
        p.created_at,
        p.updated_at,
        c.name AS category_name,
        p.isFeatured
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC;
    `;

    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response) => {
  // const userId = req.user.id;
  try {
    //     if (userId) {
    //       const featuredProducts = await sql`
    //   SELECT p.id, p.name, p.description, p.stock_quantity, p.price, p.images, p.created_at, p.updated_at, p.isFeatured,
    //     CASE
    //       WHEN uw.product_id IS NOT NULL THEN true
    //       ELSE false
    //     END AS isInWishlist
    //   FROM products p
    //   LEFT JOIN user_wishlist uw ON p.id = uw.product_id AND uw.user_id = ${userId}
    //   WHERE p.isFeatured = true
    //   ORDER BY p.created_at DESC;
    // `;
    //       res.status(200).json(featuredProducts);
    //       return;
    //     }
    const redisFeaturedProducts = await redis.get("featured_products");
    if (redisFeaturedProducts) {
      res.status(200).json(JSON.parse(redisFeaturedProducts));
      return;
    }
    const featuredProducts =
      await sql`SELECT * FROM products WHERE isFeatured=${true} ORDER BY created_at DESC`;

    if (!featuredProducts) {
      throw new Error("No featured products found");
    }
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { newProduct, urls, newSizes } = req.body;
  try {
    const {
      name,
      description,
      barcode,
      stock_quantity,
      price,
      category_id,
      isFeatured,
    } = newProduct;

    const query = isFeatured
      ? sql`
    INSERT INTO products (name, description, barcode, stock_quantity, stock_buy_price, price, images, category_id, isFeatured)
    VALUES (${name}, ${description}, ${barcode}, ${stock_quantity}, ${price},${price}, ${urls},${category_id}, ${isFeatured})
    RETURNING *;
  `
      : sql`
    INSERT INTO products (name, description, barcode, stock_quantity, stock_buy_price, price, images, category_id)
    VALUES (${name}, ${description}, ${barcode}, ${stock_quantity}, ${price},${price}, ${urls}, ${category_id})
    RETURNING *;
  `;

    const product = await query;

    const productId = product[0].id;
    console.log("product_id", productId);
    console.log("sizes", newSizes);
    if (newSizes.length > 0) {
      const sizeInsertPromises = newSizes.map(
        (size: { size: string; stock_quantity: number; price: number }) => {
          return sql`
          INSERT INTO product_sizes (product_id, size, stock_quantity)
          VALUES (${productId}, ${size.size}, ${size.stock_quantity});`;
        }
      );
      await Promise.all(sizeInsertPromises);
    }
    res.status(200).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error uploading images or creating product", error);
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [product] = await sql`SELECT * FROM products WHERE id=${id}`;

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.images && product.images.length > 0) {
      for (let image of product.images) {
        const publicId = image.split("/").pop().split(".")[0];

        try {
          await cloudinary.uploader.destroy(`products/${publicId}`);
          console.log(`Deleted image from Cloudinary: ${image}`);
        } catch (error) {
          console.log(`Error deleting image from Cloudinary: ${image}`, error);
        }
      }
    }

    await sql`DELETE FROM products WHERE id=${id}`;

    res.json({ message: "Product and its images deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getRecommendedProducts = async (_: Request, res: Response) => {
  try {
    const products = await sql`
        SELECT *
        FROM products
        ORDER BY random()
        LIMIT 6;
      `;

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;
  try {
    const products =
      await sql`SELECT * FROM products WHERE category_id=${category}`;
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const toggleFeaturedProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [product] = await sql`SELECT * FROM products WHERE id=${id}`;
    if (product) {
      const updatedIsFeatured = !product.isfeatured;
      const updatedProduct = await sql`
      UPDATE products
      SET isFeatured = ${updatedIsFeatured}
      WHERE id = ${id}
      RETURNING *;
    `;
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const updateFeaturedProductsCache = async () => {
  try {
    const featuredProducts =
      await sql`SELECT * FROM products WHERE isFeatured=${true}`;
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in update cache function");
  }
};
