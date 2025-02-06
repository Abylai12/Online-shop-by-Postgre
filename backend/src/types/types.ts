export interface User {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface Coupon {
  user_id: string;
  code: string;
  discount_percentage: number;
  valid_from: Date;
  valid_until: Date;
}
export interface OrderItems {
  id: string;
  product_id: string;
  order_id: string;
  quantity: number;
  price: number;
  size: string;
  productSizeId: string;
}

export type Products = {
  id: string;
  barcode: number;
  name: string;
  description: string;
  stock_buy_price: number;
  price: number;
  stock_quantity: number;
  category_id: string;
  images: string[];
  isFeatured: boolean;
};
