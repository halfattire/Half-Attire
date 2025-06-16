"use client"

import { IoClose, IoCartOutline } from "react-icons/io5"
import { backend_url } from "../lib/server"

function SingleWhislist({ data, removeFromWishlistHandler, handleAddToCart }) {
  // NEW: Helper function to get display price
  const getDisplayPrice = () => {
    if (data.isVariableProduct && data.variations && data.variations.length > 0) {
      const prices = data.variations.map((v) => v.price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)

      if (minPrice === maxPrice) {
        return minPrice
      } else {
        return `${minPrice} - ${maxPrice}`
      }
    }
    return data.discountPrice || data.originalPrice
  }

  const handleCartClick = () => {
    // For variable products, redirect to product page
    if (data.isVariableProduct) {
      window.location.href = `/product/${data._id}`
      return
    }
    handleAddToCart(data)
  }

  return (
    <div className="border-b p-4">
      <div className="flex w-full items-center gap-4">
        <div className="cursor-pointer" onClick={() => removeFromWishlistHandler(data)}>
          <IoClose />
        </div>
        <div className="min-w-20">
          <img src={`${backend_url}/${data.images[0]}`} className="h-20 w-20 object-contain" alt="" />
        </div>
        <div className="flex w-full items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{data.name}</h2>
            <h3 className="text-lg font-semibold text-[#d02222]">PKR{getDisplayPrice()}</h3>
            {data.isVariableProduct && <p className="text-sm text-gray-500">Multiple options available</p>}
          </div>
          <div className="cursor-pointer">
            <IoCartOutline
              size={22}
              title={data.isVariableProduct ? "Select options" : "Add to cart"}
              onClick={handleCartClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleWhislist
