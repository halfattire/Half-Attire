"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShoppingCart } from "react-icons/ai"
import { MdOutlineRemoveShoppingCart } from "react-icons/md"
import ProductDetailInfo from "./ProductDetailInfo"
import { backend_url, server } from "../lib/server"
import Loader from "../components/Loader"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { addTocartAction, removeFromCartAction } from "../redux/actions/cart"
import { addToWishlistAction, removeFromWishlistAction } from "../redux/actions/whishlist"
import axios from "axios"
import { toast } from "react-toastify"

function ProductDetail({ data }) {
  // Keep all existing state
  const [count, setCount] = useState(1)
  const [click, setClick] = useState(false)
  const [select, setSelect] = useState(0)
  const [inCart, setInCart] = useState(false)

  // NEW: Minimal addition for variations
  const [selectedVariation, setSelectedVariation] = useState(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  const dispatch = useDispatch()
  const router = useRouter()
  const cart = useSelector((state) => state.cart.cart)
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { wishlist = [] } = useSelector((state) => state.wishlist)
  const { products } = useSelector((state) => state.products)

  // Keep existing useEffect
  useEffect(() => {
    const isInCart = cart.some((item) => item._id === data._id)
    setInCart(isInCart)
    if (wishlist && wishlist.find((item) => item._id === data._id)) {
      setClick(true)
    } else {
      setClick(false)
    }
  }, [cart, data._id, wishlist])

  // NEW: Initialize variations - minimal addition
  useEffect(() => {
    if (data?.isVariableProduct && data?.variations && data.variations.length > 0) {
      const firstVariation = data.variations[0]
      setSelectedVariation(firstVariation)
      setSelectedSize(firstVariation.size || "")
      setSelectedColor(firstVariation.color || "")
    }
  }, [data])

  // NEW: Helper functions for variations - minimal addition
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

  const getCurrentPrice = () => {
    if (data?.isVariableProduct && selectedVariation) {
      return selectedVariation.price
    }
    return data?.discountPrice || data?.originalPrice
  }

  const getCurrentStock = () => {
    if (data?.isVariableProduct && selectedVariation) {
      return selectedVariation.stock
    }
    return data?.stock
  }

  // Keep all existing functions unchanged
  const removeFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(removeFromWishlistAction(data))
  }

  const addFromWishlistHandler = (data) => {
    setClick(!click)
    dispatch(addToWishlistAction(data))
  }

  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id
      const userId = user._id
      const sellerId = data.shop._id
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          router.push(`/inbox?/${res.data.conversation._id}`)
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "Error creating conversation")
        })
    } else {
      toast.error("Please login to create a conversation")
    }
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

  const handleCartClick = () => {
    // Minimal change: check for variation selection
    if (data?.isVariableProduct && !selectedVariation) {
      toast.error("Please select product options")
      return
    }

    const productToAdd = {
      ...data,
      qty: count,
      selectedVariation: selectedVariation || null,
    }

    if (inCart) {
      dispatch(removeFromCartAction(data._id))
    } else {
      dispatch(addTocartAction(productToAdd))
    }
    setInCart(!inCart)
  }

  if (!data) {
    return (
      <h1 className="p-6 text-center">
        <Loader />
      </h1>
    )
  }

  const { images, name, description, originalPrice, discountPrice, shop } = data

  if (!images || images.length === 0) {
    console.log("No images available for this product.")
  }

  const productReviewsLength = products && products.reduce((acc, product) => acc + (product.reviews?.length || 0), 0)

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) => acc + (product.reviews?.reduce((sum, review) => sum + (review.rating || 0), 0) || 0),
      0,
    )

  const avg = totalRatings / productReviewsLength || 0
  const averageRating = avg.toFixed(1)

  return (
    <div className="bg-white">
      {data ? (
        <div className="container mx-auto px-4">
          <div className="w-full py-5">
            <div className="flex flex-col items-start gap-6 md:flex-row">
              {/* Keep existing left section unchanged */}
              <div className="flex w-full flex-col items-center md:w-1/2">
                <div className="relative mb-4 h-[350px] w-[80%]">
                  <Image
                    src={images && images.length > 0 ? `${backend_url}/${images[select]}` : "/assets/placeholder.png"}
                    className="object-contain"
                    alt={name || "Product Image"}
                    fill
                    sizes="(max-width: 768px) 80vw, 40vw"
                  />
                </div>
                <div className="flex w-full items-center justify-center gap-4 overflow-x-auto">
                  {images &&
                    images.map((i, index) => (
                      <div key={index} className={`${select === index ? "border" : ""} cursor-pointer`}>
                        <div className="relative mr-3 mt-3 h-24 w-24 flex-shrink-0 overflow-hidden">
                          <Image
                            src={`${backend_url}/${i}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="object-contain"
                            fill
                            sizes="96px"
                            onClick={() => setSelect(index)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* right section with minimal additions */}
              <div className="w-full px-1.5 pt-5 md:w-1/2">
                <h1 className="font-Roboto text-2xl font-[600] text-[#333]">{name || "Product Name"}</h1>
                <p className="pt-2">{description || "No description available."}</p>

                <div className="flex items-center pt-3">
                  <h5 className="font-Roboto text-[18px] font-bold text-[#333]">{getCurrentPrice()}PKR</h5>
                  {!data?.isVariableProduct && discountPrice && (
                    <h5 className="pl-2 text-[16px] font-[500] text-[#d55b45] line-through">{originalPrice}PKR</h5>
                  )}
                </div>

                {/* NEW: Variation selection - only shows for variable products */}
                {data?.isVariableProduct && data?.variations && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Select Options</h3>

                    {getUniqueSizes().length > 0 && (
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">Size</label>
                        <div className="flex flex-wrap gap-2">
                          {getUniqueSizes().map((size) => (
                            <button
                              key={size}
                              onClick={() => handleSizeChange(size)}
                              className={`rounded-md border px-3 py-2 text-sm font-medium ${
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
                        <label className="mb-2 block text-sm font-medium text-gray-700">Color</label>
                        <div className="flex flex-wrap gap-2">
                          {getUniqueColors().map((color) => (
                            <button
                              key={color}
                              onClick={() => handleColorChange(color)}
                              className={`rounded-md border px-3 py-2 text-sm font-medium ${
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
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-600">
                          Selected: {selectedVariation.size && `Size ${selectedVariation.size}`}
                          {selectedVariation.size && selectedVariation.color && " • "}
                          {selectedVariation.color && `Color ${selectedVariation.color}`}
                        </p>
                        <p className="text-sm text-gray-600">Stock: {selectedVariation.stock} available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Keep existing quantity and wishlist section */}
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

                {/* Stock warning - minimal addition */}
                {getCurrentStock() < 5 && getCurrentStock() > 0 && (
                  <p className="mt-2 text-sm text-orange-600">Only {getCurrentStock()} left in stock!</p>
                )}

                {getCurrentStock() === 0 && <p className="mt-2 text-sm text-red-600">Out of stock</p>}

                {/* Keep existing cart button with minimal changes */}
                <button
                  className={`my-4 flex items-center gap-2 rounded-md px-5 py-3 text-white ${
                    getCurrentStock() === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : inCart
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-black hover:bg-gray-800"
                  }`}
                  onClick={handleCartClick}
                  disabled={getCurrentStock() === 0}
                >
                  {getCurrentStock() === 0 ? (
                    "Out of Stock"
                  ) : inCart ? (
                    <>
                      Remove from cart <MdOutlineRemoveShoppingCart size={22} />
                    </>
                  ) : (
                    <>
                      Add to cart <AiOutlineShoppingCart size={22} />
                    </>
                  )}
                </button>

                {/* Keep existing shop info section unchanged */}
                <div className="my-8 flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-6">
                  {/* <div className="flex items-center gap-2">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={shop?.avatar ? `${backend_url}/${shop.avatar}` : "/assets/placeholder.png"}
                        className="rounded-full"
                        alt={shop?.name || "Shop Avatar"}
                        fill
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <Link href={`/shop/preview/${data?.shop._id}`}>
                        <h3 className="text-[15px] text-blue-400">{shop?.name || "Unknown Shop"}</h3>
                      </Link>
                      <h5 className="text-[15px]">{averageRating} Ratings</h5>
                    </div>
                  </div> */}
                  <button
                    className="my-3 flex items-center gap-2 hover:cursor-pointer rounded-md bg-indigo-800 px-5 py-3 text-white"
                    onClick={handleMessageSubmit}
                  >
                    Send Message <AiOutlineMessage size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailInfo data={data} />
        </div>
      ) : (
        <h1 className="p-6 text-center">Product not found!</h1>
      )}
    </div>
  )
}

export default ProductDetail
