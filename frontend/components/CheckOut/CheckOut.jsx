"use client"

import { useState } from "react"
import ShippingInfo from "./ShippingInfo"
import CartData from "./CartData"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import axios from "axios"
import { server } from "../../lib/server"

function CheckOut() {
  const { user } = useSelector((state) => state.user)
  const { cart = [] } = useSelector((state) => state.cart)

  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [userInfo, setUserInfo] = useState(false)
  const [address1, setAddress1] = useState("")
  const [address2, setAddress2] = useState("")
  const [zipCode, setZipCode] = useState(null)
  const [couponCode, setCouponCode] = useState("")
  const [couponCodeData, setCouponCodeData] = useState(null)
  const [discountPrice, setDiscountPrice] = useState(null)

  const router = useRouter()

  const paymentSubmit = (e) => {
    e.preventDefault()

    if (address1 === "" || address2 === "" || country === "" || city === "" || zipCode === null) {
      toast.error("Please choose your delivered address")
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      }

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice: discountPrice ? discountPrice : 0,
        shippingAddress,
        user,
      }

      localStorage.setItem("latestOrder", JSON.stringify(orderData))
      router.push("/payment")
    }
  }

  // Updated subtotal calculation for variable products
  const subTotalPrice = cart.reduce((acc, item) => {
    const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.discountPrice || item.originalPrice
    return acc + item.qty * itemPrice
  }, 0)

  // UPDATED: Free shipping - set to 0
  const shipping = 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    const name = couponCode

    await axios.get(`${server}/couponscode/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId
      const couponCodeValue = res.data.couponCode?.value
      if (res.data.couponCode !== null) {
        const isCouponValid = cart && cart.filter((item) => item.shopId === shopId)

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop")
          setCouponCode("")
        } else {
          // Updated eligible price calculation for variable products
          const eligiblePrice = isCouponValid.reduce((acc, item) => {
            const itemPrice = item.selectedVariation
              ? item.selectedVariation.price
              : item.discountPrice || item.originalPrice
            return acc + item.qty * itemPrice
          }, 0)
          const discountPrice = (eligiblePrice * couponCodeValue) / 100
          setDiscountPrice(discountPrice)
          setCouponCodeData(res.data.couponCode)
          setCouponCode("")
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code doesn't exist!")
        setCouponCode("")
      }
    })
  }

  const discountPercentenge = couponCodeData ? discountPrice : 0

  // UPDATED: Total price calculation with free shipping
  const totalPrice = couponCodeData
    ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
    : (subTotalPrice + shipping).toFixed(2)

  return (
    <>
      <div className="mx-auto flex w-11/12 flex-col items-start gap-6 md:flex-row lg:w-[80%]">
        <ShippingInfo
          user={user}
          country={country}
          setCountry={setCountry}
          city={city}
          setCity={setCity}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          address1={address1}
          setAddress1={setAddress1}
          address2={address2}
          setAddress2={setAddress2}
          zipCode={zipCode}
          setZipCode={setZipCode}
        />
        <CartData
          handleSubmit={handleSubmit}
          totalPrice={totalPrice}
          shipping={shipping}
          subTotalPrice={subTotalPrice}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          discountPercentenge={discountPercentenge}
        />
      </div>
      <div
        className="mx-auto my-3 mb-10 mt-10 flex h-[50px] w-[150px] cursor-pointer items-center justify-center rounded-xl bg-black md:w-[280px]"
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </>
  )
}

export default CheckOut
