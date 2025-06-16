"use client";

import { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { backend_url, server } from "../../lib/server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";

function UserOrderDetails() {
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { user } = useSelector((state) => state.user);
  const [status, setStatus] = useState();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const dispatch = useDispatch();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (e) => {
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(null);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: "Processing refund",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="section min-h-screen py-4 pb-10">
      <div className="flex items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-2">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="text-xl font-semibold">Order Details</h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-8">
        <h5 className="flex items-center gap-1 text-gray-600">
          Order ID: <span>#{data && data._id}</span>
        </h5>
        <h5 className="flex items-center gap-1 text-gray-600">
          Placed On: <span>{data && data.createdAt.slice(0, 10)}</span>
        </h5>
      </div>

      {/* order items */}
      {data &&
        data?.cart.map((item, index) => (
          <div key={index} className="mb-5 flex w-full items-start gap-4">
            <div className="flex flex-shrink-0 items-center justify-center bg-white">
              <Image
                src={
                  item.images[0]
                    ? `${backend_url}/${item.images[0]}`
                    : "/assets/placeholder.png"
                }
                className="h-20 w-20 bg-white object-contain"
                alt={item.name || "Product"}
                width={80}
                height={80}
              />
            </div>
            <div className="flex w-full flex-col items-start gap-4 md:flex-row">
              <div className="w-full">
                <h5>{item?.name}</h5>
                <h5 className="text-sm text-gray-500">
                  PKR{item?.discountPrice} * {item?.qty}
                </h5>
              </div>
              <div className="">
                {!item.isReviewed && data?.status === "Delivered" && (
                  <button
                    onClick={() => {
                      setOpen(true);
                      setSelectedItem(item);
                    }}
                    className="cursor-pointer whitespace-nowrap rounded-md bg-indigo-800 px-4 py-2 text-white"
                  >
                    Write a review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

      <div className="w-full border-t border-black pt-4 text-right">
        <h5 className="text-lg">
          Total Price: <strong>PKR{data?.totalPrice}</strong>
        </h5>
      </div>
      <br />

      <div className="w-full items-start md:flex">
        <div className="w-full md:w-3/5">
          <h4 className="pt-3 text-lg font-semibold">Shipping Address:</h4>
          <h4 className="pt-3 text-lg">
            {data?.shippingAddress.address1 +
              " " +
              data?.shippingAddress.address2}
          </h4>
          <h4 className="text-lg">{data?.shippingAddress.country}</h4>
          <h4 className="text-lg">{data?.shippingAddress.city}</h4>
          <h4 className="text-lg">{data?.user?.phoneNumber}</h4>
        </div>
        <div className="w-full md:w-2/5">
          <h4 className="py-3 text-lg font-semibold">Payment Info:</h4>
          <h4>
            Status:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Not Paid"}
          </h4>
          {data?.status === "Delivered" && (
            <button
              onClick={refundHandler}
              className="my-4 rounded-md bg-indigo-800 px-5 py-2.5 text-white"
            >
              Give a Refund
            </button>
          )}
        </div>
      </div>
      <br />

      <Link href="#">
        <button className="rounded-md bg-indigo-800 px-5 hover:cursor-pointer py-2.5 text-white">
          Send Message
        </button>
      </Link>

      {/* review popup */}
      {open && (
        <div className="fixed left-0 top-0 z-[500] flex h-screen w-full items-center justify-center bg-gray-800/50 p-6 shadow-sm">
          <div className="custom-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-md bg-[#fff] p-3 shadow">
            <div className="flex w-full justify-end p-3">
              <RxCross1
                size={30}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>
            <h2 className="text-center font-Poppins text-[30px] font-[500]">
              Give a Review
            </h2>
            <br />
            <div className="flex w-full">
              <Image
                src={
                  selectedItem?.images[0]
                    ? `${backend_url}/${selectedItem.images[0]}`
                    : "/assets/placeholder.png"
                }
                alt={selectedItem?.name || "Product"}
                className="h-[80px] w-[80px]"
                width={80}
                height={80}
              />
              <div>
                <div className="line-clamp-2 pl-3 text-lg">
                  {selectedItem?.name}
                </div>
                <h4 className="pl-3 text-lg">
                  PKR{selectedItem?.discountPrice} x {selectedItem?.qty}
                </h4>
              </div>
            </div>

            <br />
            <br />

            {/* ratings */}
            <h5 className="pl-3 text-lg font-[500]">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="ml-2 flex w-full pt-1">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ),
              )}
            </div>
            <br />
            <div className="ml-3 w-full">
              <label className="block text-lg font-[500]">
                Write a comment
                <span className="ml-1 text-[16px] font-[400] text-[#00000052]">
                  (optional)
                </span>
              </label>
              <textarea
                name="comment"
                cols="20"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your product? write your expresion about it!"
                className="mt-2 w-[95%] border p-2 outline-none"
              ></textarea>
            </div>
            <button
              className={`ml-3 rounded-md bg-blue-500 px-6 py-2 text-lg text-white hover:bg-blue-600`}
              onClick={rating > 1 ? reviewHandler : null}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserOrderDetails;