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
import logo from "../public/assets/logo.jpeg"
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
    return "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
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
      <div className="container mx-auto px-4">
        {/* top navbar section */}
        <div className="relative my-[20px] hidden h-[35px] items-center justify-between md:flex">
          <div>
            <Link href="/">
              <Image
                src={logo || "/placeholder.svg"}
                alt="Logo"
                width={100}
                height={10}
                className="w-[80px] md:w-[100px]"
              />
            </Link>
          </div>
          {/* Search box */}
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full rounded-lg border-2 border-blue-600 bg-gray-50 p-2 text-gray-900 focus:ring-blue-600"
            />
            <AiOutlineSearch size={30} className="absolute right-2 top-2 cursor-pointer" />
            {searchTerm && searchData && (
              <div className="absolute top-full z-10 mt-2 w-full overflow-y-auto bg-white p-4 shadow-lg">
                {searchData.length === 0 ? (
                  <div className="flex w-full items-start py-2">
                    <h1>No products found</h1>
                  </div>
                ) : (
                  searchData.map((item) => (
                    <Link key={`${item._id}-${item.name}`} href={`/product/${item._id}`}>
                      <div className="flex w-full items-start py-2 hover:bg-gray-100">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                          <Image
                            src={`${backend_url}/${item?.images[0]}`}
                            alt={item.name}
                            width={40}
                            height={40}
                            className="mr-2 h-full w-full object-contain"
                            unoptimized
                          />
                        </div>
                        <h1 className="line-clamp-2">{item.name}</h1>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
          {/* seller button */}
          <div className="my-3 flex items-center gap-2 rounded-md bg-indigo-800 px-5 py-3 text-white">
            <Link
              href={user?.role === "admin" ? "/shop-login" : "#"}
              onClick={(e) => {
                if (!isAuthenticated) {
                  e.preventDefault()
                  toast.error("Please login first")
                  router.push("/login")
                } else if (user?.role !== "admin") {
                  e.preventDefault()
                  toast.error("Only admin users can access seller features")
                }
              }}
              className={`flex items-center justify-center ${
                user?.role === "admin" ? "text-[#fff]" : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <h1>Admin Panel</h1>
              {user?.role !== "admin" && <IoIosArrowForward className="ml-1" />}
            </Link>
          </div>
        </div>
      </div>
      {/* mobile navbar */}
      <div className="sticky top-0 z-[250] bg-gray-100 pb-2 shadow-md md:hidden">
        <div className="container mx-auto px-4 py-8 flex h-14 w-full items-center justify-between">
          {/* mobile logo */}
          <div>
            <Link href="/">
              <Image src={logo || "/placeholder.svg"} alt="Logo" width={80} height={40} className="w-[60px]" />
            </Link>
          </div>
          {/* nav icons */}
          <div>
            <div className="flex items-center gap-4">
              <div onClick={() => setOpenWhishlist(true)} className="relative cursor-pointer">
                <AiOutlineHeart size={30} className="text-black" />
                <span className="font-mono absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#3bc177] text-xs leading-tight text-white">
                  {wishlist && wishlist.length}
                </span>
              </div>
              <div onClick={() => setOpenCart(true)} className="relative cursor-pointer">
                <AiOutlineShoppingCart size={30} className="text-black" />
                <span className="font-mono absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#3bc177] text-xs leading-tight text-white">
                  {cart ? cart.length : 0}
                </span>
              </div>
              {/* Mobile User Menu */}
              <div className="relative user-menu-container">
                {isAuthenticated ? (
                  <div className="flex-shrink-0 cursor-pointer">
                    <Image
                      src={getAvatarUrl() || "/placeholder.svg"}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover object-top"
                      unoptimized
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      onError={(e) => {
                        e.target.src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                      }}
                    />
                    {/* Mobile User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Profile Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                          >
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <CgProfile size={30} className="text-black" />
                  </Link>
                )}
              </div>
              <div className="" onClick={() => setOpenNNavbar(true)}>
                <BiMenuAltLeft size={35} className="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
        {/* search bar */}
        <div className="container mx-auto px-4 w-full">
          <input
            type="search"
            placeholder="Search Products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="block w-full rounded-lg border-2 h-9 border-blue-600 bg-gray-100 p-2 text-gray-900 focus:ring-blue-600"
          />
          {searchTerm && searchData && (
            <div className="container mx-auto px-4 absolute top-full z-10 mt-2 w-full bg-white p-4 shadow-lg">
              {searchData.length === 0 ? (
                <div className="flex w-full items-start py-2">
                  <h1>No products found</h1>
                </div>
              ) : (
                searchData.map((item) => (
                  <Link key={`${item._id}-${item.name}`} href={`/product/${item._id}`}>
                    <div className="flex w-full items-start py-2 hover:bg-gray-100">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center">
                        <Image
                          src={`${backend_url}/${item?.images[0]}`}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="mr-2 h-full w-full object-contain"
                          unoptimized
                        />
                      </div>
                      <h1 className="line-clamp-2">{item.name}</h1>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {/* mobile side navbar */}
      {openNavbar && (
        <div className="fixed inset-0 top-0 z-[270] h-full w-full animate-fadeIn overflow-y-auto bg-black/50">
          <div className="relative h-full w-full max-w-60 bg-white">
            <div onClick={() => setOpenNNavbar(false)} className="absolute right-2 top-2 cursor-pointer">
              <RxCross1 size={25} />
            </div>
            <ul className="flex flex-col gap-4 pl-6 pt-14">
              {navItems.map((item, index) => (
                <li key={index} className="list-none">
                  <Link
                    href={item.url}
                    className={clsx(
                      "font-semibold transition-colors duration-200",
                      pathname === item.url ? "text-indigo-800" : "text-black hover:text-indigo-900",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile sidebar user section */}
            {isAuthenticated && (
              <div className="border-t mt-4 pt-4 px-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={getAvatarUrl() || "/placeholder.svg"}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover object-top mr-3"
                    unoptimized
                    onError={(e) => {
                      e.target.src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md mb-2"
                  onClick={() => setOpenNNavbar(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md disabled:opacity-50 flex items-center"
                >
                  <FiLogOut className="mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}

            <div className="flex w-full cursor-pointer items-center justify-center">
              <Link
                href={user?.role === "admin" ? "/shop-login" : "#"}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault()
                    toast.error("Please login first")
                    router.push("/login")
                  } else if (user?.role !== "admin") {
                    e.preventDefault()
                    toast.error("Only admin users can access seller features")
                  }
                }}
                className={`my-3 flex items-center gap-2 rounded-md px-9 py-3 ${
                  user?.role === "admin" ? "bg-indigo-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <h1>Admin Panel</h1>
                {user?.role !== "admin" && <IoIosArrowForward className="ml-1" />}
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* bottom navbar */}
      <div
        className={clsx("z-30 h-[70px] w-full", {
          "sticky top-0 bg-[#3321c8] shadow-md": active,
          "hidden bg-[#3321c8] md:block": !active,
        })}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* categories */}
          <div
            onClick={() => setDropDown(!dropDown)}
            className="relative flex h-[70px] items-center md:w-[190px] lg:w-[270px]"
          >
            <BiMenuAltLeft size={30} className="absolute left-2 top-1/2 mt-1.5 -translate-y-1/2" />
            <button className="font-sans mt-[10px] flex h-[60px] w-full select-none items-center justify-between rounded-t-md bg-white pl-10 text-lg font-[500]">
              All Categories
            </button>
            <IoIosArrowDown size={20} className="absolute right-2 top-1/2 mt-1.5 -translate-y-1/2 cursor-pointer" />
            {dropDown && <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />}
          </div>
          {/* nav links */}
          <div>
            <Navbar />
          </div>
          {/* nav icons */}
          <div>
            <div className="flex items-center">
              <div onClick={() => setOpenWhishlist(true)} className="relative mr-4 cursor-pointer">
                <AiOutlineHeart size={30} className="text-white opacity-75" />
                <span className="font-mono absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#3bc177] text-xs leading-tight text-white">
                  {wishlist && wishlist.length}
                </span>
              </div>
              <div onClick={() => setOpenCart(true)} className="relative mr-4 cursor-pointer">
                <AiOutlineShoppingCart size={30} className="text-white opacity-75" />
                <span className="font-mono absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#3bc177] text-xs leading-tight text-white">
                  {cart ? cart.length : 0}
                </span>
              </div>
              {/* Desktop User Menu */}
              <div className="relative user-menu-container">
                {isAuthenticated ? (
                  <div className="flex-shrink-0 cursor-pointer">
                    <Image
                      src={getAvatarUrl() || "/placeholder.svg"}
                      alt="User avatar"
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover object-top"
                      unoptimized
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      onError={(e) => {
                        e.target.src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                      }}
                    />
                    {/* Desktop User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 border-b">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Profile Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50 flex items-center"
                          >
                            <FiLogOut className="mr-2" />
                            {isLoggingOut ? "Logging out..." : "Logout"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <CgProfile size={30} className="text-white opacity-75" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* cart popup */}
      {openCart && <CartPopUp setOpenCart={setOpenCart} />}
      {/* wishlist popup */}
      {openWhishlist && <WhishListPopUp setOpenWhishlist={setOpenWhishlist} />}
    </>
  )
}

export default Header
