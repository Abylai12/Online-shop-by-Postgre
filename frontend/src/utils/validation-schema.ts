import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
      .string()
      .min(8, { message: "Be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
      .regex(/[0-9]/, { message: "Contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Contain at least one special character.",
      })
      .trim(),
    repeatPassword: z
      .string()
      .min(8, { message: "Be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match",
    path: ["repeatPassword"],
  });

export const ProductSchema = z.object({
  name: z.string().min(1, { message: "Product name is required." }),
  description: z.string().min(1, { message: "Description is required." }),

  // Barcode should be a string, but we can ensure that it only contains numeric characters
  barcode: z.string().min(1, { message: "Barcode is required." }),
  isFeatured: z.boolean().optional(),

  // Price should be a valid number
  price: z
    .string()
    .min(1, { message: "Price is required." })
    .refine((val) => !isNaN(Number(val)), {
      message: "Price must be a valid number.",
    })
    .transform((val) => parseFloat(val)), // Converts the string to a number

  // Stock quantity should be a valid number
  stock_quantity: z
    .string()
    .min(1, { message: "Stock quantity is required." })
    .refine((val) => !isNaN(Number(val)), {
      message: "Stock quantity must be a valid number.",
    })
    .transform((val) => parseInt(val, 10)), // Converts the string to a number

  stock_buy_price: z
    .string()
    .min(1, { message: "Stock buy price is required." })
    .refine((val) => !isNaN(Number(val)), {
      message: "Stock buy price must be a valid number.",
    })
    .transform((val) => parseFloat(val)), // Converts the string to a number

  images: z
    .array(z.string())
    .min(1, { message: "At least one image is required." }),

  category_id: z
    .array(z.string())
    .min(1, { message: "At least one category is required." }),
});
