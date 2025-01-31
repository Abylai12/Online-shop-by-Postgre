"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { useState } from "react";
import { Carts, User } from "@/utils/types";
import { toast } from "react-toastify";
import axios from "axios";
import { apiURL } from "@/utils/apiURL";

interface CartContextType {
  getCartItems: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  carts: Carts[] | [];
}
export const CartContext = createContext<CartContextType>({
  getCartItems: () => {},
  setUser: () => {},
  carts: [],
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [carts, setCarts] = useState<Carts[]>([]);

  const getCartItems = async () => {
    try {
      const res = await axios.get(`${apiURL}/cart`, { withCredentials: true });

      if (res.status === 200) {
        setCarts(res.data);
      }
    } catch (error) {
      toast.error("An error occurred");
    }

    useEffect(() => {
      getCartItems();
    }, []);
    return (
      <CartContext.Provider
        value={{
          getCartItems,
          setUser,
          carts,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  };
};

export const useCart = () => useContext(CartContext);
