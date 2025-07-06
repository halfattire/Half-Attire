import React, { useState } from "react";

const PaymentInfo = ({
  user,
  open,
  setOpen,
  adminCardPaymentHandler,
  cashOnDeliveryHandler,
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="mt-4 w-full rounded-md bg-white p-6 shadow-sm md:w-3/5">
      <div>
        <div className="mb-2 flex w-full border-b pb-5">
          <div
            className="relative flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-full border-[3px] border-[#1d1a1ab4] bg-transparent"
            onClick={() => setSelect(1)}
          >
            {select === 1 && (
              <div className="h-[13px] w-[13px] rounded-full bg-[#1d1a1acb]" />
            )}
          </div>
          <h4 className="pl-2 text-[18px] font-[600] text-[#000000b1]">
            Pay with Admin Card
          </h4>
        </div>

        {select === 1 && (
          <div className="flex w-full border-b">
            <form className="w-full" onSubmit={adminCardPaymentHandler}>
              <div className="mt-2 mb-4">
                <p className="text-sm text-gray-600">
                  Payment will be processed using the admin's secure payment system.
                </p>
              </div>
              <input
                type="submit"
                value="Pay with Admin Card"
                className="mt-4 w-full cursor-pointer rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              />
            </form>
          </div>
        )}

        <br />

        <div>
          <div className="mb-2 flex w-full border-b pb-5">
            <div
              className="relative flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-full border-[3px] border-[#1d1a1ab4] bg-transparent"
              onClick={() => setSelect(2)}
            >
              {select === 2 && (
                <div className="h-[13px] w-[13px] rounded-full bg-[#1d1a1acb]" />
              )}
            </div>
            <h4 className="pl-2 text-[18px] font-[600] text-[#000000b1]">
              Pay with Paypal
            </h4>
          </div>

          {select === 2 && (
            <div>
              <form>
                <div>
                  <label
                    htmlFor="paypalEmail"
                    className="mb-1 mt-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    PayPal Email
                  </label>
                  <input
                    type="email"
                    id="paypalEmail"
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="my-3 flex w-[150px] cursor-pointer items-center justify-center rounded-lg bg-[#f63b60] py-2.5 text-[18px] font-[600] text-[#fff]"
                >
                  Pay Now
                </button>
              </form>
            </div>
          )}
        </div>

        <br />

        <div>
          <div className="mb-2 flex w-full border-b pb-5">
            <div
              className="relative flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-full border-[3px] border-[#1d1a1ab4] bg-transparent"
              onClick={() => setSelect(3)}
            >
              {select === 3 && (
                <div className="h-[13px] w-[13px] rounded-full bg-[#1d1a1acb]" />
              )}
            </div>
            <h4 className="pl-2 text-[18px] font-[600] text-[#000000b1]">
              Cash on Delivery
            </h4>
          </div>
          {select === 3 && (
            <div>
              <form onSubmit={cashOnDeliveryHandler}>
                <button
                  type="submit"
                  className="my-3 flex w-[150px] cursor-pointer items-center justify-center rounded-lg bg-[#f63b60] py-2.5 text-[18px] font-[600] text-[#fff]"
                >
                  Confirm
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
