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
import { useAuth } from "./AuthContext";

interface CartContextType {
  getCartItems: () => void;
  removeAllCartItems: () => void;
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
  removeAllCartItems: () => {},
  setRefetch: () => {},
  getMyCoupon: () => {},
  applyCoupon: async () => {},
  refetch: false,
  carts: [],
  coupon: null,
  isCouponApplied: false,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [carts, setCarts] = useState<Carts[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const removeAllCartItems = async () => {
    try {
      const res = await axiosInstance.delete("/cart/remove-all");
      if (res.status === 200) {
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCartItems = async () => {
    const res = await axiosInstance.get(`/cart`);
    if (res.status === 200) {
      setCarts(res.data.products);
    }
  };
  const getMyCoupon = async () => {
    try {
      const res = await axiosInstance.get("/coupons");
      setCoupon(res.data);
      setIsCouponApplied(true);
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  };
  const applyCoupon = async (code: string) => {
    try {
      const res = await axiosInstance.post("/coupons/validate", { code });
      switch (res.status) {
        case 200:
          setCoupon(res.data);
          toast.success("successfully");
          break;
        case 201:
          toast.warning(res.data.message);
          break;

        case 202:
          toast.warning(res.data.message);
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error("Coupon expired");
    }
  };

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [refetch]);
  return (
    <CartContext.Provider
      value={{
        getMyCoupon,
        getCartItems,
        applyCoupon,
        setRefetch,
        removeAllCartItems,
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
