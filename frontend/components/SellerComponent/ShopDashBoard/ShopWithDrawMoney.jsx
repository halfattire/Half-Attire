"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "@/redux/actions/order"; // Adjust path based on your project structure
import { getAllShopProducts } from "@/redux/actions/product"; // Adjust path based on your project structure

function ShopWithDrawMoney() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const { seller } = useSelector((state) => state.seller);
  const [deliveredOrder, setDeliveredOrder] = useState(null);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllShopProducts(seller._id));
    }

    const orderData =
      orders && Array.isArray(orders) && orders.filter((item) => item.state === "Delivered");
    setDeliveredOrder(orderData);
  }, [dispatch, seller?._id, orders]);

  const totalEarningWithoutTax =
    deliveredOrder &&
    deliveredOrder.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

  const serviceCharge = totalEarningWithoutTax ? totalEarningWithoutTax * 0.1 : 0;
  const availableBalance = totalEarningWithoutTax
    ? (totalEarningWithoutTax - serviceCharge).toFixed(2)
    : "0.00";

  return (
    <div className="h-[80vh] w-full p-6">
      <div className="flex h-full w-full flex-col items-center justify-center rounded-md bg-white">
        <h5 className="pb-4 text-[20px]">
          Available Balance PKR {availableBalance}
        </h5>
        <button className="inline-block rounded-md bg-indigo-800 px-6 py-2 text-white hover:bg-indigo-900">
          Withdraw
        </button>
      </div>
    </div>
  );
}

export default ShopWithDrawMoney;