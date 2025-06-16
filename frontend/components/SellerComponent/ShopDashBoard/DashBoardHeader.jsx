"use client";

import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { backend_url } from "@/lib/server";
import logo from "../../../public/assets/logo1.png";

function DashBoardHeader() {
  const { seller } = useSelector((state) => state.seller);
  return (
    <div className="sticky top-0 z-50 h-20 w-full bg-white shadow-sm">
      <div className="flex h-20 items-center justify-between px-4">
        {/* logo */}
        <div className="">
        <Link href="/">
              <Image
                src={logo}
                alt="Logo"
                width={100}
                height={10}
                className="w-[120px] md:w-[100px]"
              />
            </Link>
        </div>
        {/* dashboard navbar icons */}
        <div className="flex items-center gap-10">
          <Link href="/dashboard-coupouns" className="hidden md:block">
            <AiOutlineGift size={30} color="#555" />
          </Link>
          <Link href="/dashboard-events" className="hidden md:block">
            <MdOutlineLocalOffer size={30} color="#555" />
          </Link>
          <Link href="/dashboard-products" className="hidden md:block">
            <FiShoppingBag size={30} color="#555" />
          </Link>
          <Link href="/dashboard-orders" className="hidden md:block">
            <FiPackage size={30} color="#555" />
          </Link>
          <Link href="/dashboard-messages" className="hidden md:block">
            <BiMessageSquareDetail size={30} color="#555" />
          </Link>
          <Link href={`/shop/${seller._id}`}>
            <Image
              src={
                seller.avatar
                  ? `${backend_url}/${seller.avatar}`
                  : "/assets/fallback-avatar.png"
              }
              className="h-10 w-10 rounded-full object-cover object-top"
              alt="Seller Avatar"
              width={40}
              height={40}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashBoardHeader;




// "use client"

// import { AiOutlineGift } from "react-icons/ai"
// import { BiMessageSquareDetail } from "react-icons/bi"
// import { MdOutlineLocalOffer } from "react-icons/md"
// import { FiPackage, FiShoppingBag } from "react-icons/fi"
// import { useSelector } from "react-redux"
// import Link from "next/link"
// import Image from "next/image"
// import { backend_url } from "@/lib/server"
// import logo from "../../../public/assets/logo1.png"

// function DashBoardHeader() {
//   const { seller } = useSelector((state) => state.seller)

//   const getAvatarUrl = (avatar) => {
//     if (!avatar) return "/assets/fallback-avatar.png"
//     if (avatar.startsWith("http")) return avatar
//     return `${backend_url}/${avatar}`
//   }

//   const navItems = [
//     {
//       href: "/dashboard-coupouns",
//       icon: AiOutlineGift,
//       label: "Coupons",
//       color: "#555",
//     },
//     {
//       href: "/dashboard-events",
//       icon: MdOutlineLocalOffer,
//       label: "Events",
//       color: "#555",
//     },
//     {
//       href: "/dashboard-products",
//       icon: FiShoppingBag,
//       label: "Products",
//       color: "#555",
//     },
//     {
//       href: "/dashboard-orders",
//       icon: FiPackage,
//       label: "Orders",
//       color: "#555",
//     },
//     {
//       href: "/dashboard-messages",
//       icon: BiMessageSquareDetail,
//       label: "Messages",
//       color: "#555",
//     },
//   ]

//   return (
//     <>
//       {/* Main Header - Changed from sticky to fixed */}
//       <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md border-b border-gray-200">
//         <div className="flex h-full items-center justify-between px-4 lg:px-6">
//           {/* Logo */}
//           <div className="flex-shrink-0">
//             <Link href="/" className="block">
//               <Image
//                 src={logo || "/placeholder.svg"}
//                 alt="Dashboard Logo"
//                 width={120}
//                 height={40}
//                 className="h-8 w-auto md:h-10"
//                 priority
//               />
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-6">
//             {navItems.map((item) => {
//               const IconComponent = item.icon
//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   className="group relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//                   title={item.label}
//                 >
//                   <IconComponent
//                     size={24}
//                     className="text-gray-600 group-hover:text-gray-800 transition-colors duration-200"
//                   />
//                 </Link>
//               )
//             })}
//           </div>

//           {/* Seller Profile */}
//           <div className="flex items-center space-x-3">
//             <Link href={`/shop/${seller?._id}`} className="group relative">
//               <div className="relative">
//                 <Image
//                   src={getAvatarUrl(seller?.avatar) || "/placeholder.svg"}
//                   className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-200"
//                   alt={seller?.name || "Seller Avatar"}
//                   width={40}
//                   height={40}
//                   onError={(e) => {
//                     e.target.src = "/assets/fallback-avatar.png"
//                   }}
//                 />
//                 <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
//               </div>
//             </Link>

//             <div className="hidden lg:block">
//               <p className="text-sm font-medium text-gray-900 truncate max-w-32">{seller?.name || "Seller"}</p>
//               <p className="text-xs text-gray-500">{seller?.role || "Seller"}</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Mobile Navigation - Fixed at bottom */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
//         <div className="flex justify-around items-center">
//           {navItems.map((item) => {
//             const IconComponent = item.icon
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href}
//                 className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
//               >
//                 <IconComponent size={20} className="text-gray-600 mb-1" />
//                 <span className="text-xs text-gray-600">{item.label}</span>
//               </Link>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Content Spacer - Ensures content isn't hidden behind headers */}
//       <div className="pt-16 pb-16 md:pb-0"></div>
//     </>
//   )
// }

// export default DashBoardHeader
