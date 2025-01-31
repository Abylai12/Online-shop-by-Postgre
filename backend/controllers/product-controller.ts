import { redis } from "../config/redis";
import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { sql } from "../config/connect-to-tb";

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await sql`SELECT * FROM products`;
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const getFeaturedProducts = async (_: Request, res: Response) => {
  //   let featuredProducts: Products | null = null;
  try {
    const redisFeaturedProducts = await redis.get("featured_products");
    if (redisFeaturedProducts) {
      res.status(200).json(JSON.parse(redisFeaturedProducts));
      return;
    }

    const featuredProducts =
      await sql`SELECT * FROM products WHERE isFeatured=${true}`;

    if (!featuredProducts) {
      throw new Error("No featured products found");
    }

    // store in redis for future quick access

    await redis.set("featured_products", JSON.stringify(featuredProducts));

    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    description,
    barcode,
    stock_quantity,
    price,
    images,
    category,
  } = req.body;

  try {
    let uploadedImagesUrls: string[] = [];

    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
          folder: "products",
        });
        uploadedImagesUrls.push(cloudinaryResponse.secure_url);
      }
    }

    const newProduct = {
      name,
      description,
      barcode,
      stock_quantity,
      price,
      images: uploadedImagesUrls, // Store Cloudinary URLs in the database
      category,
    };

    const [product] = await sql`
      INSERT INTO products (name, description, barcode, stock_quantity, stock_buy_price, price, images, category)
      VALUES (${newProduct.name}, ${newProduct.description}, ${
      newProduct.barcode
    }, ${newProduct.stock_quantity}, ${newProduct.price},${
      newProduct.price
    }, ${JSON.stringify(newProduct.images)}, ${newProduct.category})
      RETURNING *;
    `;

    res.status(201).json({ message: "Product created successfully", product });
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
        SELECT id, name, description, image, price
        FROM products
        ORDER BY random()
        LIMIT 6;
      `;

    res.json(products);
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
    res.json({ products });
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
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
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
