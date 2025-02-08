"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { useState } from "react";
import { User } from "@/utils/types";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axios-instance";

interface AuthContextType {
  getCurrentUser: () => void;
  logout: () => void;
  setUser: Dispatch<SetStateAction<User | null>>;
  user: User | null;
}
export const AuthContext = createContext<AuthContextType>({
  getCurrentUser: () => {},
  logout: () => {},
  setUser: () => {},
  user: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const [initialized, setInitialized] = useState(false);

  const getCurrentUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/profile");
      if (res.status === 200) {
        setUser(res.data);
      }
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setInitialized(true);
    }
  };

  const logout = async () => {
    try {
      const res = await axiosInstance.get("/auth/logout");
      if (res.status === 200) {
        setUser(null);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during logout");
    }
  };
  useEffect(() => {
    if (!initialized) {
      getCurrentUser();
    }
  }, [initialized]);
  return (
    <AuthContext.Provider
      value={{
        logout,
        getCurrentUser,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
