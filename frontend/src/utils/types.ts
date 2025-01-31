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
  category_id: string;
  images: string[];
  isFeatured: boolean;
};

export type InputProduct = {
  barcode: string;
  name: string;
  description: string;
  price: string;
  stock_quantity: string;
  category_id: string;
  images: string[];
};

export type Carts = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  product_name: string;
  product_price: number;
};
export type Coupon = {
  id: string;
  code: string;
  discount_percentage: number;
  isActive: boolean;
  user_id: string;
};
export type Category = {
  id: string;
  name: string;
};
