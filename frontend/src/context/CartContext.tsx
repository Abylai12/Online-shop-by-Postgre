"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { useState } from "react";
import { Carts, Coupon } from "@/utils/types";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axios-instance";

interface CartContextType {
  getCartItems: () => void;
  getMyCoupon: () => void;
  applyCoupon: (code: string) => Promise<void>;
  setRefetch: Dispatch<SetStateAction<boolean>>;
  carts: Carts[] | [];
  coupon: Coupon | null;
  isCouponApplied: boolean;
  refetch: boolean;
}
export const CartContext = createContext<CartContextType>({
  getCartItems: () => {},
  setRefetch: () => {},
  getMyCoupon: () => {},
  applyCoupon: async () => {},
  refetch: false,
  carts: [],
  coupon: null,
  isCouponApplied: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [carts, setCarts] = useState<Carts[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const getCartItems = async () => {
    try {
      const res = await axiosInstance.get(`/cart`);

      if (res.status === 200) {
        setCarts(res.data.products);
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };
  const getMyCoupon = async () => {
    try {
      const res = await axiosInstance.get("/coupons");
      console.log("coupon", res.data);
      setCoupon(res.data);
      setIsCouponApplied(true);
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  };
  const applyCoupon = async (code: string) => {
    try {
      const res = await axiosInstance.post("/coupons/validate", { code });
      setCoupon(res.data);
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  useEffect(() => {
    getCartItems();
  }, [refetch]);
  return (
    <CartContext.Provider
      value={{
        getMyCoupon,
        getCartItems,
        applyCoupon,
        setRefetch,
        refetch,
        coupon,
        carts,
        isCouponApplied,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
