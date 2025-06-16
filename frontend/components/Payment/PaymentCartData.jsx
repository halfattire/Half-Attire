/* eslint-disable no-unused-vars */

function PaymentCartData({ orderData }) {
  return (
    <div className="w-full rounded-md bg-white p-6 shadow-sm md:mt-4 md:w-2/5">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">subtotal</p>
          <p className="text-base font-semibold text-gray-600">
            PKR{orderData && orderData?.subTotalPrice}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">shipping</p>
          <p className="text-base font-semibold text-gray-600">
            PKR{orderData && orderData?.shipping.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600">Discount</p>
          <p className="text-base font-semibold text-gray-600">
            PKR{orderData && orderData.discountPrice.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex items-center justify-end gap-4">
          <p className="text-base font-semibold text-gray-600">
            PKR{orderData && orderData?.totalPrice}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentCartData;
