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

function ProductCard({ data, isEvent }) {
  const [click, setClick] = useState(false)
  const [open, setOpen] = useState(false)
  const [inCart, setInCart] = useState(false)

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

  const removeFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(removeFromWishlistAction(data))
  }

  const addFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(addToWishlistAction(data))
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

  const handleCartClick = () => {
    // For variable products, redirect to product page for variation selection
    if (data.isVariableProduct) {
      window.location.href = `/product/${data._id}`
      return
    }

    if (inCart) {
      dispatch(removeFromCartAction(data._id))
    } else {
      const cartData = { ...data, qty: 1 }
      dispatch(addTocartAction(cartData))
    }
    setInCart(!inCart)
  }

  return (
    <>
      <div className="relative h-[340px] w-full cursor-pointer rounded-lg bg-white p-3 shadow-sm md:max-w-72"> 
        <Link href={isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}>
          <Image
            src={
              data.images && data.images.length > 0
                ? `${backend_url}/${data.images[0]}`
                : "https://cdn-icons-png.flaticon.com/128/44/44289.png"
            }
            alt={data.name}
            width={200}
            height={170}
            className="h-[170px] w-11/12 object-contain pr-2"
            unoptimized
          />
        </Link>
        {/* <Link href={`/shop/preview/${data?.shop._id}`}>
          <h5 className="py-3 text-[15px] text-blue-400">{data.shop?.name || "Unknown Shop"}</h5>
        </Link> */}
        <Link href={`/product/${productId}`}>
          <h5 className="mb-2 line-clamp-2 font-medium">{data?.name}</h5>
        </Link>
        <div className="flex">
          <Ratings rating={data?.ratings} />
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
          <AiFillHeart
            size={22}
            className="absolute right-2 top-5 cursor-pointer"
            onClick={() => removeFromWishlistHandler(data)}
            color="red"
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="absolute right-2 top-5 cursor-pointer"
            onClick={() => addFromWishlistHandler(data)}
            color="#333"
            title="Add to wishlist"
          />
        )}
        <AiOutlineEye
          size={22}
          className="absolute right-2 top-14 cursor-pointer"
          onClick={() => setOpen(!open)}
          color="#333"
          title="Quick View"
        />
        <div
          className="absolute right-2 top-24 cursor-pointer"
          onClick={handleCartClick}
          title={data.isVariableProduct ? "Select options" : inCart ? "Remove from cart" : "Add to cart"}
        >
          {data.isVariableProduct ? (
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
