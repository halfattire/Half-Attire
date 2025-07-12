"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { AiFillHeart, AiOutlineEye, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai"
import { MdOutlineRemoveShoppingCart } from "react-icons/md"
import ProductDetailsPopup from "./ProductDetailsPopup"
import { backend_url } from "../lib/server"
import { useDispatch, useSelector } from "react-redux"
import { addTocartAction, removeFromCartAction } from "../redux/actions/cart"
import { addToWishlistAction, removeFromWishlistAction } from "../redux/actions/whishlist.js"
import Ratings from "./Ratings"
import { enhanceProductRating } from "../lib/utils/shopRating"
import LoadingSpinner from "./LoadingSpinner"

function ProductCard({ data, isEvent }) {
  const [click, setClick] = useState(false)
  const [open, setOpen] = useState(false)
  const [inCart, setInCart] = useState(false)
  const [cartLoading, setCartLoading] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const dispatch = useDispatch()
  const { cart = [] } = useSelector((state) => state.cart)
  const { wishlist = [] } = useSelector((state) => state.wishlist)

  const productId = data._id

  // NEW: Helper function to get display price for variable products
  const getDisplayPrice = () => {
    if (data.isVariableProduct && data.variations && data.variations.length > 0) {
      const prices = data.variations.map((v) => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      if (minPrice === maxPrice) {
        return `${minPrice}PKR`
      } else {
        return `${minPrice}PKR - ${maxPrice}PKR`
      }
    }
    return data.discountPrice ? data.discountPrice : data.originalPrice
  }

  // NEW: Helper function to get original price for variable products
  const getOriginalPrice = () => {
    if (data.isVariableProduct) {
      return null // Don't show original price for variable products
    }
    return data.originalPrice
  }

  const removeFromWishlistHandler = async (data) => {
    setWishlistLoading(true)
    try {
      setClick(!click)
      await dispatch(removeFromWishlistAction(data))
    } finally {
      setWishlistLoading(false)
    }
  }

  const addFromWishlistHandler = async (data) => {
    setWishlistLoading(true)
    try {
      setClick(!click)
      await dispatch(addToWishlistAction(data))
    } finally {
      setWishlistLoading(false)
    }
  }

  useEffect(() => {
    if (cart) {
      const isItemInCart = cart.some((item) => item._id === data._id)
      setInCart(isItemInCart)
    }
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true)
    } else {
      setClick(false)
    }
  }, [cart, data._id, wishlist])

  const handleCartClick = async () => {
    // For variable products, redirect to product page for variation selection
    if (data.isVariableProduct) {
      window.location.href = `/product/${data._id}`
      return
    }

    setCartLoading(true)
    try {
      if (inCart) {
        await dispatch(removeFromCartAction(data._id))
      } else {
        const cartData = { ...data, qty: 1 }
        await dispatch(addTocartAction(cartData))
      }
      setInCart(!inCart)
    } finally {
      setCartLoading(false)
    }
  }

  return (
    <>
      <div className="relative h-[340px] w-full cursor-pointer rounded-lg bg-white p-3 shadow-sm md:max-w-72"> 
        <Link href={isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}>
          <div className="relative h-[170px] w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
                <LoadingSpinner size="md" color="gray" />
              </div>
            )}
            <Image
              src={
                data.images && data.images.length > 0
                  ? data.images[0].startsWith('http') 
                    ? data.images[0] 
                    : `${backend_url}/${data.images[0]}`
                  : "https://cdn-icons-png.flaticon.com/128/44/44289.png"
              }
              alt={data.name}
              width={200}
              height={170}
              className="h-[170px] w-11/12 object-contain pr-2"
              unoptimized
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        </Link>
        <Link href={`/shop/preview/${data?.shop._id}`}>
          <h5 className="py-3 text-[15px] text-blue-400">{data.shop?.name || "Unknown Shop"}</h5>
        </Link>
        <Link href={`/product/${productId}`}>
          <h5 className="mb-2 line-clamp-2 font-medium">{data?.name}</h5>
        </Link>
        <div className="flex">
          <Ratings rating={enhanceProductRating(data?.ratings, data?.reviews?.length)} />
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center">
            <h5 className="font-Roboto text-[18px] font-bold text-[#333]">{getDisplayPrice()}</h5>
            {getOriginalPrice() && data.discountPrice && (
              <h5 className="pl-2 text-[16px] font-[500] text-[#d55b45] line-through">{getOriginalPrice()}PKR</h5>
            )}
          </div>
          <div className="text-[17px] font-normal text-[#68d284]">
            <h5>{data?.sold_out} sold</h5>
          </div>
        </div>

        {/* Side options */}
        {click ? (
          <div 
            className="absolute right-2 top-5 cursor-pointer flex items-center justify-center w-6 h-6"
            onClick={() => removeFromWishlistHandler(data)}
          >
            {wishlistLoading ? (
              <LoadingSpinner size="sm" color="red" />
            ) : (
              <AiFillHeart
                size={22}
                color="red"
                title="Remove from wishlist"
              />
            )}
          </div>
        ) : (
          <div 
            className="absolute right-2 top-5 cursor-pointer flex items-center justify-center w-6 h-6"
            onClick={() => addFromWishlistHandler(data)}
          >
            {wishlistLoading ? (
              <LoadingSpinner size="sm" color="current" />
            ) : (
              <AiOutlineHeart
                size={22}
                color="#333"
                title="Add to wishlist"
              />
            )}
          </div>
        )}
        <AiOutlineEye
          size={22}
          className="absolute right-2 top-14 cursor-pointer"
          onClick={() => setOpen(!open)}
          color="#333"
          title="Quick View"
        />
        <div
          className="absolute right-2 top-24 cursor-pointer flex items-center justify-center w-6 h-6"
          onClick={handleCartClick}
          title={data.isVariableProduct ? "Select options" : inCart ? "Remove from cart" : "Add to cart"}
        >
          {cartLoading ? (
            <LoadingSpinner size="sm" color="current" />
          ) : data.isVariableProduct ? (
            <AiOutlineShoppingCart size={25} color="#444" />
          ) : inCart ? (
            <MdOutlineRemoveShoppingCart size={25} color="#444" />
          ) : (
            <AiOutlineShoppingCart size={25} color="#444" />
          )}
        </div>
        {open && <ProductDetailsPopup setOpen={setOpen} data={data} />}
      </div>
    </>
  )
}

export default ProductCard
