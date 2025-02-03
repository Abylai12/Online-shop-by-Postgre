"use client";

import axiosInstance from "@/utils/axios-instance";
import { Category, InputProduct } from "@/utils/types";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

type InputForm = {
  newProduct: InputProduct;
  setNewProduct: Dispatch<SetStateAction<InputProduct>>;
};

const ProductForm = ({ newProduct, setNewProduct }: InputForm) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/category");
      if (res.status === 200) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <div className="flex-1">
      <div className="mb-2 flex items-center space-x-4">
        <input
          type="checkbox"
          id="terms"
          checked={newProduct.isFeatured}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              isFeatured: e.target.checked,
            })
          }
          className="appearance-none w-4 h-4 border-4 border-gray-600 rounded-full bg-gray-700 checked:bg-emerald-600 checked:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-300 ease-in-out"
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium text-gray-300 cursor-pointer hover:text-emerald-300 transition duration-200"
        >
          Featured Product
        </label>
      </div>

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                   px-3 text-white focus:outline-none focus:ring-2
                  focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Product Barcode
        </label>
        <input
          type="text"
          id="name"
          name="barcode"
          value={newProduct.barcode}
          onChange={(e) =>
            setNewProduct({ ...newProduct, barcode: e.target.value })
          }
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
                   px-3 text-white focus:outline-none focus:ring-2
                  focus:ring-emerald-500 focus:border-emerald-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-300"
        >
          Quantity
        </label>
        <input
          type="number"
          id="stock_quantity"
          name="stock_quantity"
          value={newProduct.stock_quantity}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              stock_quantity: Number(e.target.value),
            })
          }
          step="0.01"
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                  py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
                   focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-300"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: Number(e.target.value) })
          }
          step="0.01"
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
                  py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
                   focus:border-emerald-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-300"
        >
          Category
        </label>
        <select
          id="category"
          name="category"
          value={newProduct.category_id}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category_id: e.target.value })
          }
          className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
                   shadow-sm py-2 px-3 text-white focus:outline-none 
                   focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category, idx) => (
            <option key={idx} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductForm;
