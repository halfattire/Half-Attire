"use client"

/* eslint-disable no-unused-vars */

function CartData({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
}) {
  return (
    <div className="w-full rounded-md bg-white p-6 shadow-sm md:mt-4 md:w-2/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">subtotal</p>
          <p className="text-base font-semibold text-gray-600">PKR{subTotalPrice}</p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">shipping</p>
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold text-gray-600">PKR{shipping.toFixed(2)}</p>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">FREE</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">Discount</p>
          <p className="text-base font-semibold text-gray-600">
            {discountPercentenge ? "- PKR" + discountPercentenge.toFixed(2) : "- PKR0.00"}
          </p>
        </div>
        <hr />
        <div className="flex items-center justify-end gap-4">
          <p className="text-base font-semibold text-gray-600">PKR{totalPrice}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="couponCode"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          />
          <button className="mt-4 w-full rounded-md border border-[#f63b60] bg-transparent p-2 text-center text-[#f63b60] transition-all duration-300 hover:bg-[#f63b60] hover:text-white">
            Apply Coupon
          </button>
        </form>
      </div>
    </div>
  )
}

export default CartData
