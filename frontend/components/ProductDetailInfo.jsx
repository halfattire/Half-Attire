"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { backend_url } from "../lib/server";
import { useSelector } from "react-redux";
import Ratings from "./Ratings";
import WriteReviewForm from "./WriteReviewForm";
import { getAvatarUrl, handleAvatarError } from "../lib/utils/avatar";
import SafeAvatar from "./SafeAvatar";
import { calculateShopRating, getShopRatingText } from "../lib/utils/shopRating";

// Props:
// - data: Object containing product details (description, shop, reviews)
function ProductDetailInfo({ data, isEvent = false }) {
  const [active, setActive] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const { allProducts, products } = useSelector((state) => state.products);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleReviewSubmitted = () => {
    // Force a refresh of the component by updating the key
    setRefreshKey(prev => prev + 1);
    // Optionally switch to reviews tab to show the new review
    setActive(2);
  };

  // Filter products by shop ID
  const shopProducts = allProducts.filter(
    (product) => product.shopId === data.shop._id
  );

  // Enhanced shop rating calculation
  const shopRatingData = calculateShopRating(products);
  const shopRatingText = getShopRatingText(shopRatingData.reviewCount);

  return (
    <div className="pb-12">
      <div className="rounded-md bg-[#f5f6fb] px-4 py-2 pb-6 md:px-10">
        <div className="flex w-full items-center justify-between gap-2 border-b pb-2 pt-10 overflow-x-auto">
          <div className="relative flex-shrink-0">
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
          <div className="relative flex-shrink-0">
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
          <div className="relative flex-shrink-0">
            <h5
              className={`cursor-pointer px-1 text-base font-semibold text-[#000] sm:text-lg md:text-[20px] ${
                active === 3 ? "text-crimson" : ""
              }`}
              onClick={() => setActive(3)}
            >
              Write Review
            </h5>
            {active === 3 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <h5
              className={`cursor-pointer px-1 text-base font-semibold text-[#000] sm:text-lg md:text-[20px] ${
                active === 4 ? "text-crimson" : ""
              }`}
              onClick={() => setActive(4)}
            >
              Seller Information
            </h5>
            {active === 4 && (
              <div className="absolute bottom-[-27%] left-0 h-[3px] w-full bg-[crimson]"></div>
            )}
          </div>
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
                    <SafeAvatar
                      src={item?.user?.avatar}
                      alt={item.user?.name || "User"}
                      width={50}
                      height={50}
                      className="h-[50px] w-[50px] flex-shrink-0 rounded-full object-cover"
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

          {active === 3 && (
            <div className="min-h-[40vh] w-full">
              <WriteReviewForm 
                productId={data._id} 
                onReviewSubmitted={handleReviewSubmitted}
                isEvent={isEvent}
              />
            </div>
          )}

          {active === 4 && data && data.shop && (
            <div className="mt-6 block w-full p-4 md:flex">
              {/* left */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3">
                  <div>
                    <SafeAvatar
                      src={data?.shop?.avatar}
                      alt={data?.shop?.name || "Shop Avatar"}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <Link href={`/shop/preview/${data?.shop._id}`}>
                      <h3 className="text-[15px] text-blue-400 hover:text-blue-600">
                        {data?.shop?.name || "Unknown Shop"}
                      </h3>
                    </Link>
                    <h5 className="text-[15px] text-gray-600">
                      Shop Rating: {shopRatingData.displayRating}/5.0 ({shopRatingText})
                    </h5>
                  </div>
                </div>
                <p className="pt-6 text-gray-700">{data?.shop?.description}</p>
              </div>
              {/* right */}
              <div className="mt-5 w-full flex-col items-end md:mt-0 md:flex md:w-1/2">
                <div className="space-y-3 text-left md:text-right">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-800">
                      Joined on{" "}
                      <span className="font-medium text-blue-600">
                        {data?.shop?.createdAt?.slice(0, 10)}
                      </span>
                    </h5>
                    <h5 className="font-semibold text-gray-800 mt-2">
                      Total Products{" "}
                      <span className="font-medium text-blue-600">{shopProducts.length}</span>
                    </h5>
                    <h5 className="font-semibold text-gray-800 mt-2">
                      Total Reviews{" "}
                      <span className="font-medium text-blue-600">{shopRatingData.reviewCount}</span>
                    </h5>
                  </div>
                  {/* <Link href={`/shop/preview/${data?.shop._id}`}>
                    <button className="mt-4 w-full cursor-pointer rounded-md bg-black hover:bg-gray-800 px-6 py-3 text-white transition-colors">
                      Visit Shop
                    </button>
                  </Link> */}
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