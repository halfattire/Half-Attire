"use client"

import { useState, useEffect } from "react"
import { categoriesData, navItems } from "../lib/data"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai"
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io"
import { BiMenuAltLeft } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"
import { RxCross1 } from "react-icons/rx"
import { FiLogOut } from "react-icons/fi"
import clsx from "clsx"
import DropDown from "./DropDown"
import Navbar from "./Navbar"
import { useSelector, useDispatch } from "react-redux"
import { backend_url } from "../lib/server"
import CartPopUp from "./CartPopUp"
import WhishListPopUp from "./WhishListPopUp"
import logo from "../public/assets/logo1.png"
import { logout } from "../redux/actions/user"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.user)
  const { allProducts } = useSelector((state) => state.products)
  const { isSeller } = useSelector((state) => state.seller)
  const { cart } = useSelector((state) => state.cart)
  const { wishlist } = useSelector((state) => state.wishlist)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchData, setSearchData] = useState(null)
  const [active, setActive] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [openWhishlist, setOpenWhishlist] = useState(false)
  const [openNavbar, setOpenNNavbar] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()

  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    const filterProducts =
      allProducts && allProducts.filter((product) => product.name.toLowerCase().includes(term.toLowerCase()))
    setSearchData(filterProducts)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    setShowUserMenu(false)

    try {
      console.log("Header: Starting logout...")
      const result = await dispatch(logout())
      console.log("Header: Logout result:", result)

      // Redirect to home page after logout
      router.push("/")
    } catch (error) {
      console.error("Header: Logout error:", error)
      toast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const getAvatarUrl = () => {
    if (user?.avatar) {
      if (user.avatar.startsWith("http")) {
        return user.avatar
      }
      return `${backend_url}/${user.avatar}`
    }
    return "/assets/fallback-avatar.png"
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 810) {
        if (window.scrollY > 120) {
          setActive(true)
        } else {
          setActive(false)
        }
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(".user-menu-container")) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <>
      {/* Modern Header Container */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 lg:px-6">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between py-4">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Search Section */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />

                {/* Search Results Dropdown */}
                {searchTerm && searchData && (
                  <div className="absolute top-full z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      {searchData.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <AiOutlineSearch className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                          <p>No products found</p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {searchData.map((item) => (
                            <Link key={`${item._id}-${item.name}`} href={`/product/${item._id}`}>
                              <div className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden">
                                  <Image
                                    src={`${backend_url}/${item?.images[0]}`}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{item.category}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Admin Panel Button */}
              <Link
                href={user?.role === "admin" ? "/admin" : "#"}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault()
                    toast.error("Please login first")
                    router.push("/login")
                  } else if (user?.role !== "admin") {
                    e.preventDefault()
                    toast.error("Only admin users can access admin panel")
                  }
                }}
                className={`hidden lg:flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${user?.role === "admin"
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
              >
                <span>Admin Panel</span>
                {user?.role === "admin" && <IoIosArrowForward className="ml-1 h-4 w-4" />}
              </Link>

              {/* Cart Icon */}
              <div className="relative">
                <button
                  onClick={() => setOpenCart(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <AiOutlineShoppingCart className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Wishlist Icon */}
              <div className="relative">
                <button
                  onClick={() => setOpenWhishlist(true)}
                  className="p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <AiOutlineHeart className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Image
                      src={getAvatarUrl()}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full border-2 border-gray-200 object-cover"
                      onError={(e) => {
                        e.target.src = "/assets/fallback-avatar.png"
                      }}
                    />
                    <IoIosArrowDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 min-w-[12rem] max-w-[16rem] w-auto bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="py-1">
                        <Link href="/profile" className="flex items-center justify-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 whitespace-nowrap flex-shrink-0">
                          <CgProfile className="mr-3 h-4 w-4 flex-shrink-0" />
                          <span className="flex-shrink-0">View Profile</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="w-full flex items-center justify-start px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                        >
                          <FiLogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                          <span className="flex-shrink-0">{isLoggingOut ? 'Signing out...' : 'Logout'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            <div className="flex items-center justify-between py-4">
              {/* Mobile Logo */}
              <Link href="/" className="flex-shrink-0">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  width={80}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>

              {/* Mobile Right Icons */}
              <div className="flex items-center space-x-3">
                {/* Wishlist */}
                <button
                  onClick={() => setOpenWhishlist(true)}
                  className="relative p-2 text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <AiOutlineHeart className="h-6 w-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => setOpenCart(true)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <AiOutlineShoppingCart className="h-6 w-6" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* User Avatar */}
                {isAuthenticated ? (
                  <div className="relative user-menu-container">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-1 rounded-full hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Image
                        src={getAvatarUrl()}
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full border-2 border-gray-200 object-cover"
                        onError={(e) => {
                          e.target.src = "/assets/fallback-avatar.png"
                        }}
                      />
                    </button>

                    {/* Mobile User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 min-w-[12rem] max-w-[16rem] w-auto bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className="flex items-center justify-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 whitespace-nowrap flex-shrink-0"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <CgProfile className="mr-3 h-4 w-4 flex-shrink-0" />
                            <span className="flex-shrink-0">View Profile</span>
                          </Link>

                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full flex items-center justify-start px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-50 whitespace-nowrap flex-shrink-0"
                          >
                            <FiLogOut className="mr-3 h-4 w-4 flex-shrink-0" />
                            <span className="flex-shrink-0">{isLoggingOut ? 'Signing out...' : 'Logout'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <CgProfile className="h-6 w-6" />
                  </Link>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setOpenNNavbar(true)}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  <BiMenuAltLeft className="h-7 w-7" />
                </button>
              </div>
            </div>

            {/* Mobile Search Bar */}
            <div className="pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />

                {/* Mobile Search Results */}
                {searchTerm && searchData && (
                  <div className="absolute top-full z-50 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="max-h-80 overflow-y-auto">
                      {searchData.length === 0 ? (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <AiOutlineSearch className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                          <p>No products found</p>
                        </div>
                      ) : (
                        <div className="py-2">
                          {searchData.map((item) => (
                            <Link key={`${item._id}-${item.name}`} href={`/product/${item._id}`}>
                              <div className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors duration-150">
                                <div className="flex-shrink-0 h-10 w-10 rounded-lg overflow-hidden">
                                  <Image
                                    src={`${backend_url}/${item?.images[0]}`}
                                    alt={item.name}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                  />
                                </div>
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                  <p className="text-xs text-gray-500 truncate">{item.category}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Sidebar */}
      {openNavbar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setOpenNNavbar(false)} />
          <div className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setOpenNNavbar(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <RxCross1 className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              {/* User Info in Mobile Sidebar */}
              {isAuthenticated && (
                <div className="flex items-center p-4 mb-4 bg-gray-50 rounded-xl">
                  <Image
                    src={getAvatarUrl()}
                    alt="User Avatar"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover"
                    onError={(e) => {
                      e.target.src = "/assets/fallback-avatar.png"
                    }}
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${pathname === item.url
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "text-gray-700 hover:bg-gray-50"
                      }`}
                    onClick={() => setOpenNNavbar(false)}
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              {/* Mobile Admin Panel Link */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    href={user?.role === "admin" ? "/admin" : "#"}
                    onClick={(e) => {
                      if (user?.role !== "admin") {
                        e.preventDefault()
                        toast.error("Only admin users can access admin panel")
                      } else {
                        setOpenNNavbar(false)
                      }
                    }}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${user?.role === "admin"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <span>Admin Panel</span>
                    {user?.role === "admin" && <IoIosArrowForward className="ml-auto h-4 w-4" />}
                  </Link>
                </div>
              )}

              {/* Auth Buttons */}
              {!isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                    onClick={() => setOpenNNavbar(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full px-4 py-3 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    onClick={() => setOpenNNavbar(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Logout Button */}
              {isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    <FiLogOut className="mr-3 h-4 w-4" />
                    {isLoggingOut ? 'Signing out...' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Secondary Navigation (Categories) */}
      <div
        className={`transition-all duration-300 ${active ? "sticky top-0 z-40 shadow-md" : "relative"
          } bg-blue-600 text-blue-600`}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropDown(!dropDown)}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all duration-200"
              >
                <BiMenuAltLeft className="h-5 w-5" />
                <span className="text-sm font-medium hidden sm:block">All Categories</span>
                <IoIosArrowDown className={`h-4 w-4 transition-transform duration-200 ${dropDown ? 'rotate-180' : ''}`} />
              </button>
              {dropDown && <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <Navbar />
            </div>
          </div>
        </div>
      </div>

      {/* Cart and Wishlist Popups */}
      {openCart && <CartPopUp setOpenCart={setOpenCart} />}
      {openWhishlist && <WhishListPopUp setOpenWhishlist={setOpenWhishlist} />}
    </>
  )
}

export default Header
