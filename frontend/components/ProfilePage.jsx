"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Header from "@/components/Header";
import ProfileContent from "@/components/ProfilePageComponents/ProfileContent";
import ProfileSidebar from "@/components/ProfilePageComponents/ProfileSidebar";
import Loader from "@/components/Loader";

function ProfilePage() {
  const [active, setActive] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Profile Sidebar Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center justify-between w-full p-4 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <span className="text-lg font-semibold text-gray-900">Profile Menu</span>
              <svg
                className={`w-5 h-5 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Sidebar */}
          <div className={`
            lg:block lg:w-80 lg:flex-shrink-0
            ${sidebarOpen ? 'block' : 'hidden'}
          `}>
            <div className="lg:sticky lg:top-24">
              <ProfileSidebar active={active} setActive={setActive} onItemClick={() => setSidebarOpen(false)} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <ProfileContent active={active} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;