"use client"
import { useState, useEffect } from "react"
import { FaGift, FaFire, FaStar, FaPercent, FaTruck, FaTag, FaClock, FaShoppingCart } from "react-icons/fa"

const PromotionalBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const banners = [
    {
      id: 1,
      icon: <FaPercent className="text-amber-300 text-lg md:text-xl animate-pulse" />,
      text: "🎉 Get 50% OFF on all purchases above PKR 5,000!",
      bgColor: "from-slate-700 via-slate-800 to-slate-900",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 2,
      icon: <FaTruck className="text-amber-300 text-lg md:text-xl animate-bounce" />,
      text: "🚚 FREE SHIPPING nationwide on orders over PKR 3,000!",
      bgColor: "from-indigo-600 via-indigo-700 to-indigo-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 3,
      icon: <FaFire className="text-amber-300 text-lg md:text-xl animate-pulse" />,
      text: "🔥 Flash Sale: Up to 70% OFF on premium fashion!",
      bgColor: "from-emerald-600 via-emerald-700 to-emerald-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 4,
      icon: <FaStar className="text-amber-300 text-lg md:text-xl animate-spin" />,
      text: "⭐ New Customer Special: 25% OFF your first order!",
      bgColor: "from-violet-600 via-violet-700 to-violet-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 5,
      icon: <FaClock className="text-amber-300 text-lg md:text-xl animate-pulse" />,
      text: "⏰ Same Day Delivery in Karachi, Lahore & Islamabad!",
      bgColor: "from-cyan-600 via-cyan-700 to-cyan-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 6,
      icon: <FaShoppingCart className="text-amber-300 text-lg md:text-xl animate-bounce" />,
      text: "🛍️ Weekend Special: Buy 2 Get 1 FREE on all categories!",
      bgColor: "from-rose-600 via-rose-700 to-rose-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 7,
      icon: <FaGift className="text-amber-300 text-lg md:text-xl animate-pulse" />,
      text: "🎁 Limited Time: Get a FREE gift with every PKR 10,000+ purchase!",
      bgColor: "from-orange-600 via-orange-700 to-orange-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
    {
      id: 8,
      icon: <FaTag className="text-amber-300 text-lg md:text-xl animate-bounce" />,
      text: "🏷️ Mega Sale: Up to 80% OFF on clearance items!",
      bgColor: "from-teal-600 via-teal-700 to-teal-800",
      textColor: "text-white",
      accentColor: "text-amber-300",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
        setIsAnimating(false)
      }, 300)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  const currentBannerData = banners[currentBanner]

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-700 shadow-md">
      <div
        className={`bg-gradient-to-r ${currentBannerData.bgColor} py-2 md:py-2.5 px-4 transition-all duration-700 ease-in-out transform ${
          isAnimating ? "scale-105" : "scale-100"
        }`}
        style={{
          boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2 md:space-x-4">
          {/* Left decorative element */}
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-amber-300 text-sm animate-ping">✨</span>
            <span className="text-amber-300 text-sm animate-pulse delay-75">✨</span>
          </div>

          {/* Animated icon */}
          <div className="flex-shrink-0 p-1.5 bg-white/10 rounded-full backdrop-blur-sm">{currentBannerData.icon}</div>

          {/* Animated text */}
          <div
            className={`${currentBannerData.textColor} font-bold text-xs md:text-sm lg:text-base text-center leading-tight transform transition-all duration-500 ${
              isAnimating ? "translate-y-1 opacity-75" : "translate-y-0 opacity-100"
            }`}
          >
            <span className="drop-shadow-md">{currentBannerData.text}</span>
          </div>

          {/* Right decorative element */}
          <div className="hidden md:flex items-center space-x-1">
            <span className="text-amber-300 text-sm animate-pulse delay-150">✨</span>
            <span className="text-amber-300 text-sm animate-ping delay-200">✨</span>
          </div>
        </div>

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 animate-pulse"></div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300 ease-linear shadow-sm"
            style={{
              width: `${((currentBanner + 1) / banners.length) * 100}%`,
              boxShadow: "0 0 8px rgba(245, 158, 11, 0.5)",
            }}
          />
        </div>
      </div>

      {/* Sliding indicators */}
      <div className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-1">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
              index === currentBanner
                ? "bg-amber-400 shadow-md scale-110 shadow-amber-400/50"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-amber-400 rounded-full opacity-30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default PromotionalBanner
