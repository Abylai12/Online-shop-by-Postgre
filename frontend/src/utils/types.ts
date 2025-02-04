export type User = {
  name: string;
  email: string;
  role: string;
};

export type Products = {
  barcode: number;
  id: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category_name: string;
  images: string[];
  isfeatured: boolean;
};

export type DetailProduct = {
  id: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
  category_name: string;
  images: string[];
  product_discount: number;
  product_sizes: [{ size: string; stock_quantity: number }];
  quantity_discount: number;
  total_stock_quantity: number;
};

export type InputProduct = {
  barcode: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  isFeatured: boolean;
};

export type InputSize = {
  size: string;
  stock_quantity: number;
};

export type Carts = {
  id: string;
  quantity: number;
  name: string;
  description: string;
  price: number;
  images: string[];
};
export type Coupon = {
  id: string;
  code: string;
  discount_percentage: number;
  isActive: boolean;
};
export type Category = {
  id: string;
  name: string;
  category_image: string;
};
