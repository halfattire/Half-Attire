"use client"

import { useState, useEffect } from "react"
import { RxCross1 } from "react-icons/rx"
import { AiOutlineMessage, AiOutlineShoppingCart, AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { backend_url } from "../lib/server"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { addTocartAction, removeFromCartAction } from "../redux/actions/cart"
import { addToWishlistAction, removeFromWishlistAction } from "../redux/actions/whishlist"

function ProductDetailsPopup({ setOpen, data }) {
  const { cart = [] } = useSelector((state) => state.cart)
  const { wishlist = [] } = useSelector((state) => state.wishlist)
  const [count, setCount] = useState(1)
  const [click, setClick] = useState(false)
  const [inCart, setInCart] = useState(false)

  // NEW: State for variable products
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  const dispatch = useDispatch()

  useEffect(() => {
    const isItemExists = cart.find((i) => i._id === data._id)
    setInCart(!!isItemExists)
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true)
    } else {
      setClick(false)
    }
  }, [cart, data._id, wishlist])

  // NEW: Initialize variation for variable products
  useEffect(() => {
    if (data?.isVariableProduct && data?.variations && data.variations.length > 0) {
      const firstVariation = data.variations[0]
      setSelectedVariation(firstVariation)
      setSelectedSize(firstVariation.size || "")
      setSelectedColor(firstVariation.color || "")
    }
  }, [data])

  // NEW: Helper functions for variable products
  const getDisplayPrice = () => {
    if (data.isVariableProduct && selectedVariation) {
      return selectedVariation.price
    }
    return data.discountPrice ? data.discountPrice : data.originalPrice
  }

  const getCurrentStock = () => {
    if (data.isVariableProduct && selectedVariation) {
      return selectedVariation.stock
    }
    return data.stock
  }

  const getUniqueSizes = () => {
    if (!data?.variations) return []
    return [...new Set(data.variations.map((v) => v.size).filter(Boolean))]
  }

  const getUniqueColors = () => {
    if (!data?.variations) return []
    return [...new Set(data.variations.map((v) => v.color).filter(Boolean))]
  }

  const handleSizeChange = (size) => {
    setSelectedSize(size)
    const matchingVariation = data.variations.find(
      (v) => v.size === size && (!selectedColor || v.color === selectedColor),
    )
    if (matchingVariation) {
      setSelectedVariation(matchingVariation)
      setSelectedColor(matchingVariation.color || "")
    }
  }

  const handleColorChange = (color) => {
    setSelectedColor(color)
    const matchingVariation = data.variations.find(
      (v) => v.color === color && (!selectedSize || v.size === selectedSize),
    )
    if (matchingVariation) {
      setSelectedVariation(matchingVariation)
      setSelectedSize(matchingVariation.size || "")
    }
  }

  const removeFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(removeFromWishlistAction(data))
  }

  const addFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(addToWishlistAction(data))
  }

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1)
    }
  }

  const incrementCount = () => {
    const maxStock = getCurrentStock()
    if (count < maxStock) {
      setCount(count + 1)
    }
  }

  const handleCartButtonClick = () => {
    // For variable products, check if variation is selected
    if (data.isVariableProduct && !selectedVariation) {
      toast.error("Please select product options")
      return
    }

    if (inCart) {
      dispatch(removeFromCartAction(data._id))
      setInCart(false)
    } else {
      const maxStock = getCurrentStock()
      if (maxStock < count) {
        toast.error("Product stock limited!")
      } else {
        const cartData = {
          ...data,
          qty: count,
          selectedVariation: selectedVariation || null,
        }
        dispatch(addTocartAction(cartData))
        setInCart(true)
      }
    }
  }

  return (
    <div className="bg-white">
      {data && (
        <div className="fixed left-0 top-0 z-[400] flex h-screen w-full animate-fadeIn items-center justify-center bg-[#00000030]">
          <div className="custom-scrollbar relative h-[90vh] w-11/12 overflow-y-scroll rounded-md bg-white p-4 shadow-sm md:h-[75vh] md:max-w-2xl lg:w-3/5">
            <RxCross1 size={30} className="absolute right-3 top-3 z-50 cursor-pointer" onClick={() => setOpen(false)} />
            <div className="block w-full gap-6 md:flex">
              {/* left */}
              <div className="w-full md:w-1/2">
                <div className="my-4 flex items-center justify-center">
                  <img src={`${backend_url}/${data.images[0]}`} className="w-60" alt={data.name} />
                </div>
                {/* <div className="flex items-center gap-2">
                  <div>
                    <img
                      src={`${backend_url}/${data?.shop?.avatar}`}
                      className="h-12 w-12 rounded-full"
                      alt={data.shop?.name}
                    />
                  </div>
                  <div>
                    <Link href={`/shop/preview/${data?.shop._id}`}>
                      <h3 className="text-[15px] text-blue-400">{data.shop.name || "Unknown Shop"}</h3>
                    </Link>
                    <h5 className="text-[15px]">4/5 ratings</h5>
                  </div>
                </div> */}
                {/* send message button */}
                <button
                  className="my-3 flex items-center gap-2 hover:cursor-pointer rounded-md bg-black px-5 py-3 text-white"
                  onClick={() => console.log("Message sent")}
                >
                  Send Message <AiOutlineMessage size={22} />
                </button>
                {/* sold out items */}
                <h6 className="text-base text-red-600">({data.sold_out}) sold out</h6>
              </div>
              {/* right */}
              <div className="w-full px-1.5 pt-5 md:w-1/2">
                <h1 className="text-[20px] font-semibold text-[#333]">{data.name}</h1>
                <p className="pt-2">{data.description}</p>
                <div className="flex items-center pt-3">
                  <h5 className="font-Roboto text-[18px] font-bold text-[#333]">{getDisplayPrice()}PKR</h5>
                  {!data.isVariableProduct && data.discountPrice && (
                    <h5 className="pl-2 text-[16px] font-[500] text-[#d55b45] line-through">{data.originalPrice}PKR</h5>
                  )}
                </div>

                {/* NEW: Variation selection for variable products */}
                {data?.isVariableProduct && data?.variations && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Select Options</h3>

                    {getUniqueSizes().length > 0 && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">Size</label>
                        <div className="flex flex-wrap gap-1">
                          {getUniqueSizes().map((size) => (
                            <button
                              key={size}
                              onClick={() => handleSizeChange(size)}
                              className={`rounded border px-2 py-1 text-xs font-medium ${
                                selectedSize === size
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {getUniqueColors().length > 0 && (
                      <div>
                        <label className="mb-1 block text-xs font-medium text-gray-700">Color</label>
                        <div className="flex flex-wrap gap-1">
                          {getUniqueColors().map((color) => (
                            <button
                              key={color}
                              onClick={() => handleColorChange(color)}
                              className={`rounded border px-2 py-1 text-xs font-medium ${
                                selectedColor === color
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedVariation && (
                      <div className="rounded bg-gray-50 p-2">
                        <p className="text-xs text-gray-600">
                          Selected: {selectedVariation.size && `Size ${selectedVariation.size}`}
                          {selectedVariation.size && selectedVariation.color && " • "}
                          {selectedVariation.color && `Color ${selectedVariation.color}`}
                        </p>
                        <p className="text-xs text-gray-600">Stock: {selectedVariation.stock} available</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between pr-3">
                  <div>
                    <button
                      className="rounded-l bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:opacity-75"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 px-4 py-[11px] font-medium text-gray-800">{count}</span>
                    <button
                      className="rounded-r bg-gradient-to-r from-teal-400 to-teal-500 px-4 py-2 font-bold text-white shadow-lg transition duration-300 ease-in-out hover:opacity-75"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addFromWishlistHandler(data)}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>

                {/* Stock warning */}
                {getCurrentStock() < 5 && getCurrentStock() > 0 && (
                  <p className="mt-2 text-xs text-orange-600">Only {getCurrentStock()} left in stock!</p>
                )}

                {getCurrentStock() === 0 && <p className="mt-2 text-xs text-red-600">Out of stock</p>}

                {/* add to cart / remove from cart button */}
                <button
                  className={`my-4 flex items-center gap-2 rounded-md px-5 py-3 text-white ${
                    getCurrentStock() === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : inCart
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-black hover:bg-gray-800"
                  }`}
                  onClick={handleCartButtonClick}
                  disabled={getCurrentStock() === 0}
                >
                  {getCurrentStock() === 0 ? "Out of Stock" : inCart ? "Remove from cart" : "Add to cart"}{" "}
                  <AiOutlineShoppingCart size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailsPopup
