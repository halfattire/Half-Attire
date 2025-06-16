"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

function BestDeals() {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const productData = [...allProducts].sort(
        (a, b) => b.total_sell - a.total_sell
      );
      const firstFive = productData.slice(0, 5);
      setData(firstFive);
    }
  }, [allProducts]);

  return (
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Best Deals</h1>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {data && data.length > 0 ? (
            data.map((item, index) => <ProductCard data={item} key={index} />)
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No best deals available at the moment.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BestDeals;