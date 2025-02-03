import React, { Dispatch, SetStateAction } from "react";
import { InputSize } from "@/utils/types";

type SizInputProp = {
  newSizes: InputSize[];
  setNewSizes: Dispatch<SetStateAction<InputSize[]>>;
};

const SizeInputForm = ({ newSizes, setNewSizes }: SizInputProp) => {
  const handleSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const updatedSize = e.target.value;
    setNewSizes((prevSizes) => {
      const updatedSizes = [...prevSizes];
      updatedSizes[idx] = { ...updatedSizes[idx], size: updatedSize };
      return updatedSizes;
    });
  };

  const handleQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const updatedQuantity = Number(e.target.value);
    setNewSizes((prevSizes) => {
      const updatedSizes = [...prevSizes];
      updatedSizes[idx] = {
        ...updatedSizes[idx],
        stock_quantity: updatedQuantity,
      };
      return updatedSizes;
    });
  };

  const addSize = () => {
    setNewSizes((prevSizes) => [
      ...prevSizes,
      { size: "", stock_quantity: 0, price: 0 },
    ]);
  };

  const deleteSize = (idx: number) => {
    setNewSizes((prevSizes) => prevSizes.filter((_, index) => index !== idx));
  };

  return (
    <div className=" ">
      {newSizes.map((newSize, idx) => (
        <div
          key={idx}
          className="bg-gray-800 p-4 rounded-lg shadow-md  flex items-center justify-between"
        >
          <div>
            <label
              htmlFor="size"
              className="block text-sm font-medium text-gray-300"
            >
              Product Size
            </label>
            <input
              type="text"
              id="size"
              name="size"
              value={newSize.size}
              onChange={(e) => handleSizeChange(e, idx)}
              className="mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter size (e.g., S, M, L)"
              required
            />
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-300"
            >
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="stock_quantity"
              value={newSize.stock_quantity}
              onChange={(e) => handleQuantityChange(e, idx)}
              step="1"
              className="mt-2 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => deleteSize(idx)}
            className="mt-2 text-red-500  py-1 px-2  hover:text-red-700 font-medium transition duration-150 ease-in-out"
          >
            Delete Size
          </button>
          <button
            type="button"
            onClick={addSize}
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-1 px-2 rounded-md  transition duration-200 ease-in-out transform hover:scale-105"
          >
            Add New Size
          </button>
        </div>
      ))}
    </div>
  );
};

export default SizeInputForm;
