"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axiosInstance from "@/utils/axios-instance";
import { DetailProduct, Products } from "@/utils/types";
import DetailCart from "@/components/cart/DetailCart";
import ProductCard from "@/components/cards/ProductCard";

const ProductDetailPage = () => {
  const [detail, setDetail] = useState<DetailProduct | null>(null);
  const [products, setProducts] = useState<Products[]>([]);

  const { id } = useParams();
  const getProductDetail = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}`);
      if (res.status === 200) {
        const { product } = res.data;
        setDetail(product);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getRecommended = async () => {
    try {
      const res = await axiosInstance.get(`/products/recommendations`);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProductDetail();
    getRecommended();
  }, []);
  return (
    <div className="">
      <div className=" flex justify-center px-[200px]">
        <div className="flex pt-[52px] pb-20 gap-5">
          <DetailCart product={detail} />
        </div>
      </div>
      <h1
        className="px-[200px] font-bold text-3xl
      "
      >
        Холбоотой бараа
      </h1>
      <div className="grid grid-cols-4 px-[200px] gap-4 py-5">
        {products?.map((product, idx) => (
          <div key={idx}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProductDetailPage;
