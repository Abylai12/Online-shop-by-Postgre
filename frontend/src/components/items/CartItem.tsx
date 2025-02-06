import { Minus, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { Carts } from "@/utils/types";
import axiosInstance from "@/utils/axios-instance";
import { toast } from "react-toastify";
import { useCart } from "@/context/CartContext";

const CartItem = ({ item }: { item: Carts }) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const { setRefetch } = useCart();

  const availableStock = item.size_quantity || item.stock_quantity;

  const removeFromCart = async (cartId: string) => {
    try {
      await axiosInstance.delete(`/cart`, { data: { cartId } });
      setRefetch((prev) => !prev);
      toast.success("Deleted successfully", { autoClose: 1000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete item", { autoClose: 1000 });
    }
  };

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    try {
      if (newQuantity < 1 || newQuantity > availableStock) return;

      setQuantity(newQuantity);
      await axiosInstance.put(`/cart`, { quantity: newQuantity, cartId });
      setRefetch((prev) => !prev);
    } catch (error) {
      console.error(error);
      setQuantity(item.quantity);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 md:p-6 space-y-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-20 md:w-32 flex-shrink-0">
          <img
            className="h-full w-full object-cover rounded-lg"
            src={item.images[0]}
            alt={item.name}
          />
        </div>

        <div className="flex-1 space-y-2">
          <p className="text-lg font-semibold text-white hover:text-emerald-400 transition-colors">
            {item.name}
          </p>
          <p className="text-sm text-gray-400">{item.description}</p>
          {item.size && (
            <p className="text-sm text-gray-400">Size: {item.size}</p>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, quantity - 1)}
              disabled={quantity <= 1}
              className="bg-gray-700 text-white hover:bg-gray-600 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Minus />
            </button>
            <span className="text-xl font-semibold text-white">{quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, quantity + 1)}
              disabled={quantity >= availableStock}
              className="bg-gray-700 text-white hover:bg-gray-600 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Plus />
            </button>
          </div>
          <p className="text-sm text-gray-300">
            Available stock: {availableStock}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end space-y-2">
          <p className="text-xl font-semibold text-emerald-400">
            ${item.price}
          </p>
        </div>
        <button
          onClick={() => removeFromCart(item.id)}
          className="bg-red-500 text-white hover:bg-red-400 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Trash />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
