"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

function FeaturedProduct() {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const firstTen = allProducts.slice(0, 10);
      setData(firstTen);
    }
  }, [allProducts]);

  return (
    <div>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Featured Products</h1>
        <div className="mb-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data && data.length > 0 ? (
            data.map((item, index) => <ProductCard data={item} key={index} />)
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No featured products available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeaturedProduct;