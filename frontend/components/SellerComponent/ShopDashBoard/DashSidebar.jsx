"use client";

import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import Link from "next/link";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

function DashSidebar({ active, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static top-16 left-0 z-50 
        w-64 min-h-[calc(100vh-4rem)] h-full
        bg-gray-900 shadow-lg lg:shadow-sm
        transform transition-transform duration-300 ease-in-out
        overflow-y-auto
        flex flex-col
      `}>
        <div className="p-2 flex-1">
          {/* Dashboard */}
          <SidebarItem
            href="/dashboard"
            icon={RxDashboard}
            label="Dashboard"
            active={active === 1}
            onClick={() => setSidebarOpen(false)}
          />

          {/* All Orders */}
          <SidebarItem
            href="/dashboard-orders"
            icon={FiShoppingBag}
            label="All Orders"
            active={active === 2}
            onClick={() => setSidebarOpen(false)}
          />

          {/* All Products */}
          <SidebarItem
            href="/dashboard-products"
            icon={FiPackage}
            label="All Products"
            active={active === 3}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Create Product */}
          <SidebarItem
            href="/dashboard-create-product"
            icon={AiOutlineFolderAdd}
            label="Create Product"
            active={active === 4}
            onClick={() => setSidebarOpen(false)}
          />

          {/* All Events */}
          <SidebarItem
            href="/dashboard-events"
            icon={MdOutlineLocalOffer}
            label="All Events"
            active={active === 5}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Create Event */}
          <SidebarItem
            href="/dashboard-create-event"
            icon={AiOutlineGift}
            label="Create Event"
            active={active === 6}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Withdraw Money */}
          <SidebarItem
            href="/dashboard-withdraw-money"
            icon={CiMoneyBill}
            label="Withdraw Money"
            active={active === 7}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Messages */}
          <SidebarItem
            href="/dashboard-messages"
            icon={BiMessageSquareDetail}
            label="Messages"
            active={active === 8}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Coupons */}
          <SidebarItem
            href="/dashboard-coupouns"
            icon={AiOutlineGift}
            label="Discount Codes"
            active={active === 9}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Refunds */}
          <SidebarItem
            href="/dashboard-refunds"
            icon={HiOutlineReceiptRefund}
            label="Refunds"
            active={active === 10}
            onClick={() => setSidebarOpen(false)}
          />

          {/* Settings */}
          <SidebarItem
            href="/settings"
            icon={CiSettings}
            label="Settings"
            active={active === 11}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        
        {/* Bottom gradient - ensures full background coverage */}
        <div className="h-8 bg-gradient-to-t from-gray-800 to-gray-900 flex-shrink-0"></div>
      </div>
    </>
  );
}

// Reusable sidebar item component
function SidebarItem({ href, icon: Icon, label, active, onClick }) {
  return (
    <Link href={href} onClick={onClick}>
      <div className={`
        flex items-center w-full p-3 mb-1 rounded-lg
        transition-all duration-200 ease-in-out
        hover:bg-gray-800 hover:shadow-sm
        ${active 
          ? 'bg-blue-600 text-white border-r-4 border-blue-400 shadow-md' 
          : 'text-gray-300 hover:text-white'
        }
      `}>
        <Icon
          size={24}
          className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-400'}`}
        />
        <span className={`
          ml-3 text-sm font-medium truncate
          ${active ? 'text-white' : 'text-gray-300'}
        `}>
          {label}
        </span>
      </div>
    </Link>
  );
}

export default DashSidebar;