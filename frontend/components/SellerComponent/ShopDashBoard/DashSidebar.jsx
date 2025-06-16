"use client";

import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import Link from "next/link";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

// Debug imports to identify undefined elements
console.log({
  AiOutlineFolderAdd: !!AiOutlineFolderAdd,
  AiOutlineGift: !!AiOutlineGift,
  FiPackage: !!FiPackage,
  FiShoppingBag: !!FiShoppingBag,
  MdOutlineLocalOffer: !!MdOutlineLocalOffer,
  RxDashboard: !!RxDashboard,
  VscNewFile: !!VscNewFile,
  CiMoneyBill: !!CiMoneyBill,
  CiSettings: !!CiSettings,
  BiMessageSquareDetail: !!BiMessageSquareDetail,
  HiOutlineReceiptRefund: !!HiOutlineReceiptRefund,
  Link: !!Link,
});

function DashSidebar({ active }) {
  return (
    <div className="custom-scrollbar sm:no-scrollbar sticky left-0 top-20 z-10 h-[89vh] w-full flex-shrink-0 overflow-y-auto bg-white pb-6 shadow-sm">
      {/* single item */}
      <div className="flex w-full items-center p-4">
        <Link href="/dashboard" className="flex w-full items-center">
          <RxDashboard
            size={30}
            color={`${active === 1 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 1 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-orders" className="flex w-full items-center">
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 2 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-products" className="flex w-full items-center">
          <FiPackage
            size={30}
            color={`${active === 3 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 3 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Products
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-create-product" className="flex w-full items-center">
          <AiOutlineFolderAdd
            size={30}
            color={`${active === 4 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 4 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Create Product
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-events" className="flex w-full items-center">
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 5 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 5 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Events
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-create-event" className="flex w-full items-center">
          <VscNewFile
            size={30}
            color={`${active === 6 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 6 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Create Event
          </h5>
        </Link>
      </div>

      {/* <div className="flex w-full items-center p-4">
        <Link href="/dashboard-withdraw-money" className="flex w-full items-center">
          <CiMoneyBill
            size={30}
            color={`${active === 7 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 7 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Withdraw Money
          </h5>
        </Link>
      </div> */}

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-messages" className="flex w-full items-center">
          <BiMessageSquareDetail
            size={30}
            color={`${active === 8 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 8 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Shop Inbox
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-coupouns" className="flex w-full items-center">
          <AiOutlineGift
            size={30}
            color={`${active === 9 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 9 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Discount Codes
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/dashboard-refunds" className="flex w-full items-center">
          <HiOutlineReceiptRefund
            size={30}
            color={`${active === 10 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 10 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Refunds
          </h5>
        </Link>
      </div>

      <div className="flex w-full items-center p-4">
        <Link href="/settings" className="flex w-full items-center">
          <CiSettings
            size={30}
            color={`${active === 11 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden whitespace-nowrap pl-2 pr-12 text-[18px] font-[400] md:block ${
              active === 11 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>
    </div>
  );
}

export default DashSidebar;