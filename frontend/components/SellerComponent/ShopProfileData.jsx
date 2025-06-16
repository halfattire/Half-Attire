"use client";

import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getAllShopProducts } from "@/redux/actions/product";
import Ratings from "../Ratings";
import moment from "moment";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Image from "next/image";

const REVIEWS_PER_PAGE = 5;

function ShopProfileData({ isOwner }) {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAllShopProducts(id));
  }, [id, dispatch]);

  const allReviews =
    products && products.map((product) => product.reviews).flat();

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  const paginatedReviews = allReviews
    ? allReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE,
      )
    : [];

  const totalPages = allReviews
    ? Math.ceil(allReviews.length / REVIEWS_PER_PAGE)
    : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <div className="cursor-pointer" onClick={() => setActive(1)}>
            <h5
              className={`text-lg font-semibold ${active === 1 ? "text-red-600" : "text-gray-700"}`}
            >
              Shop Products
            </h5>
          </div>
          <div className="cursor-pointer" onClick={() => setActive(2)}>
            <h5
              className={`text-lg font-semibold ${active === 2 ? "text-red-600" : "text-gray-700"}`}
            >
              Running Events
            </h5>
          </div>
          <div className="cursor-pointer" onClick={() => setActive(3)}>
            <h5
              className={`text-lg font-semibold ${active === 3 ? "text-red-600" : "text-gray-700"}`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>
        {isOwner ? (
          <button className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-700">
            <Link href="/dashboard">Go to dashboard</Link>
          </button>
        ) : (
          <button className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-700">
            <Link href="/">Go to Home</Link>
          </button>
        )}
      </div>

      {active === 1 && (
        <div className="product-grid-container my-5">
          {products && products.length > 0 ? (
            products.map((item, index) => (
              <ProductCard data={item} key={index} isShop={true} />
            ))
          ) : (
            <div className="text-center text-gray-600">
              No products available.
            </div>
          )}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="product-grid-container my-5">
            {events &&
              events.map((i, index) => (
                <ProductCard
                  data={i}
                  key={index}
                  isShop={true}
                  isEvent={true}
                />
              ))}
          </div>
          {events && events.length === 0 && (
            <h5 className="w-full py-5 text-center text-[18px]">
              No Events have for this shop!
            </h5>
          )}
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {paginatedReviews &&
            paginatedReviews.map((item, index) => (
              <div key={index} className="my-4 flex w-full border-b pb-4">
                <Image
                  src={
                    item.user.avatar
                      ? `${backend_url}/${item.user.avatar}`
                      : "https://cdn-icons-png.flaticon.com/128/9131/9131529.png"
                  }
                  className="h-10 w-10 rounded-full"
                  alt="User Avatar"
                  width={40}
                  height={40}
                />
                <div className="pl-4">
                  <div className="flex w-full items-center">
                    <h1 className="pr-2 font-[600]">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="mt-1 font-[400] text-[#000000a7]">
                    {item.comment}
                  </p>
                  <p className="mt-1 text-[14px] text-[#000000a7]">
                    {moment(item.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            ))}
          {allReviews && allReviews.length === 0 && (
            <h5 className="w-full py-5 text-center text-[18px]">
              No Reviews have for this shop!
            </h5>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="mx-2 rounded bg-gray-200 px-2 py-1 text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaArrowLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 px-2 py-1 ${
                    currentPage === index + 1
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  } rounded`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="mx-2 rounded bg-gray-200 px-2 py-1 text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ShopProfileData;