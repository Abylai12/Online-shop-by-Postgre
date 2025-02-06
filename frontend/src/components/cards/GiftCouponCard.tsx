import { useCart } from "@/context/CartContext";
import axiosInstance from "@/utils/axios-instance";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");

  const { getMyCoupon, applyCoupon, coupon, isCouponApplied, setRefetch } =
    useCart();
  useEffect(() => {
    getMyCoupon();
  }, [coupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  // const handleRemoveCoupon = async () => {
  //   await removeCoupon();
  //
  // };
  const removeCoupon = async (code: string) => {
    try {
      await axiosInstance.post("/coupons/unvalidate", { code });
      setUserInputCode("");
      setRefetch((pre) => !pre);
    } catch (error) {
      console.error(error);
      toast.error("Coupon expired");
    }
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="voucher"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Do you have a voucher or gift card?
          </label>
          <input
            type="text"
            id="voucher"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        <motion.button
          type="button"
          className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleApplyCoupon}
        >
          Apply Code
        </motion.button>
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>

          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discount_percentage}% off
          </p>

          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => removeCoupon(coupon.code)}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}

      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discount_percentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};
export default GiftCouponCard;
