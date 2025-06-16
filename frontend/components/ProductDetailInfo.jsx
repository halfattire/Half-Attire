"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { backend_url } from "../lib/server";
import { useSelector } from "react-redux";
import Ratings from "./Ratings";

// Props:
// - data: Object containing product details (description, shop, reviews)
function ProductDetailInfo({ data }) {
  const [active, setActive] = useState(1);
  const { allProducts, products } = useSelector((state) => state.products);

  // Filter products by shop ID
  const shopProducts = allProducts.filter(
    (product) => product.shopId === data.shop._id
  );

  const productReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / productReviewsLength || 0;

  const averageRating = avg.toFixed(1);

  return (
    <div className="pb-12">
      <div className="rounded-md bg-[#f5f6fb] px-4 py-2 pb-6 md:px-10">
        <div className="flex w-full items-center justify-between gap-4 border-b pb-2 pt-10">
          <div className="relative">
            <h5
              className={`cursor-pointer px-1 text-base font-semibold text-[#000] sm:text-lg md:text-[20px] ${
                active === 1 ? "text-crimson" : ""
              }`}
              onClick={() => setActive(1)}
            >
              Product Details
            </h5>
            {active === 1 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
            )}
          </div>
          <div className="relative">
            <h5
              className={`cursor-pointer px-1 text-base font-semibold text-[#000] sm:text-lg md:text-[20px] ${
                active === 2 ? "text-crimson" : ""
              }`}
              onClick={() => setActive(2)}
            >
              Product Reviews
            </h5>
            {active === 2 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
            )}
          </div>
          {/* <div className="relative">
            <h5
              className={`cursor-pointer px-1 text-base font-semibold text-[#000] sm:text-lg md:text-[20px] ${
                active === 3 ? "text-crimson" : ""
              }`}
              onClick={() => setActive(3)}
            >
              Seller Information
            </h5>
            {active === 3 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
            )}
          </div> */}
        </div>

        <div className="pt-4">
          {active === 1 && (
            <div>
              <p className="whitespace-pre-line text-balance py-2 font-Poppins text-lg font-medium">
                {data.description}
              </p>
            </div>
          )}
          {active === 2 && (
            <div className="min-h-[40vh] w-full">
              {data?.reviews.length > 0 ? (
                data.reviews.map((item, index) => (
                  <div key={index} className="my-4 flex items-center gap-3">
                    <Image
                      src={
                        item?.user?.avatar
                          ? `${backend_url}/${item.user.avatar}`
                          : "/assets/placeholder.png"
                      }
                      alt={item.user.name || "User"}
                      className="h-[50px] w-[50px] flex-shrink-0 rounded-full object-cover"
                      width={50}
                      height={50}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold leading-8 text-gray-900">
                          {item.user.name}
                        </h1>
                        <Ratings rating={item.rating} />
                      </div>
                      <p className="text-gray-700">{item.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <h5 className="text-lg font-medium text-gray-600">
                    No reviews for this product!
                  </h5>
                </div>
              )}
            </div>
          )}

          {active === 3 && data && data.shop && (
            <div className="block w-full p-4 md:flex">
              {/* left */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-2">
                  <div>
                    <Image
                      src={
                        data?.shop?.avatar
                          ? `${backend_url}/${data.shop.avatar}`
                          : "/assets/placeholder.png"
                      }
                      className="h-12 w-12 rounded-full"
                      alt={data?.shop?.name || "Shop Avatar"}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <Link href={`/shop/preview/${data?.shop._id}`}>
                      <h3 className="text-[15px] text-blue-400">
                        {data?.shop?.name || "Unknown Shop"}
                      </h3>
                    </Link>
                    <h5 className="text-[15px]">{averageRating} Ratings</h5>
                  </div>
                </div>
                <p className="pt-6">{data?.shop?.description}</p>
              </div>
              {/* right */}
              <div className="mt-5 w-full flex-col items-end md:mt-0 md:flex md:w-1/2">
                <div className="space-y-2 text-left">
                  <h5 className="font-semibold">
                    Joined on{" "}
                    <span className="font-medium">
                      {data?.shop?.createdAt?.slice(0, 10)}
                    </span>
                  </h5>
                  <h5 className="font-semibold">
                    Total Products{" "}
                    <span className="font-medium">{shopProducts.length}</span>
                  </h5>
                  <h5 className="font-semibold">
                    Total Reviews{" "}
                    <span className="font-medium">{productReviewsLength}</span>
                  </h5>
                  <Link href={`/shop/preview/${data?.shop._id}`}>
                    <button className="mt-2 cursor-pointer rounded-md bg-black px-10 py-2 text-white">
                      Visit Shop
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailInfo;