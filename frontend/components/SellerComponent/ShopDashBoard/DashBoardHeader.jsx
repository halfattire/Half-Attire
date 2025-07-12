"use client";

import { AiOutlineGift, AiOutlineFolderAdd } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { backend_url } from "@/lib/server";
import logo from "../../../public/assets/logo1.png";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

function DashBoardHeader({ sidebarOpen, setSidebarOpen }) {
  const { seller } = useSelector((state) => state.seller);
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      icon: RxDashboard,
      label: "Dashboard",
    },
    {
      href: "/dashboard-orders",
      icon: FiShoppingBag,
      label: "All Orders",
    },
    {
      href: "/dashboard-products",
      icon: FiPackage,
      label: "All Products",
    },
    {
      href: "/dashboard-create-product",
      icon: AiOutlineFolderAdd,
      label: "Create Product",
    },
    {
      href: "/dashboard-events",
      icon: MdOutlineLocalOffer,
      label: "All Events",
    },
    {
      href: "/dashboard-create-event",
      icon: AiOutlineGift,
      label: "Create Event",
    },
    {
      href: "/dashboard-withdraw-money",
      icon: CiMoneyBill,
      label: "Withdraw Money",
    },
    {
      href: "/dashboard-messages",
      icon: BiMessageSquareDetail,
      label: "Messages",
    },
    {
      href: "/dashboard-coupouns",
      icon: AiOutlineGift,
      label: "Discount Codes",
    },
    {
      href: "/dashboard-refunds",
      icon: HiOutlineReceiptRefund,
      label: "Refunds",
    },
    {
      href: "/settings",
      icon: CiSettings,
      label: "Settings",
    },
  ];

  const isActiveRoute = (href) => {
    return pathname === href;
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left Section - Menu Button & Logo */}
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-blue-50 transition-colors text-blue-600"
            >
              {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto sm:h-10"
                priority
              />
            </Link>
          </div>

          {/* Center Section - Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative p-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 shadow-md"
                      : "hover:bg-blue-50"
                  }`}
                  title={item.label}
                >
                  <IconComponent
                    size={24}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-blue-600 group-hover:text-blue-700"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right Section - Profile */}
          <div className="flex items-center gap-3">
            {/* Seller Profile */}
            <Link href={`/shop/${seller?._id}`} className="group relative">
              <div className="relative">
                <Image
                  src={
                    seller?.avatar
                      ? seller.avatar.startsWith("http") 
                        ? seller.avatar 
                        : `${backend_url}/${seller.avatar}`
                      : "/assets/fallback-avatar.png"
                  }
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-blue-200 group-hover:border-blue-300 transition-colors duration-200"
                  alt={seller?.name || "Seller Avatar"}
                  width={40}
                  height={40}
                  onError={(e) => {
                    e.target.src = "/assets/fallback-avatar.png";
                  }}
                />
                <div className="absolute bottom-0 right-0 h-2 w-2 sm:h-3 sm:w-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
            </Link>

            {/* Seller Name - Hidden on mobile */}
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                {seller?.name || "Seller"}
              </p>
              <p className="text-xs text-blue-600">Seller Dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoardHeader;
