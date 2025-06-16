/* eslint-disable no-unused-vars */
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";

function PaymentInfo({
  user,
  open,
  setOpen,
  paymentHandler,
  cashOnDeliveryHandler,
}) {
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
            Pay with Debit/credit card
          </h4>
        </div>

        {select === 1 && (
          <div className="flex w-full border-b">
            <form className="w-full" onSubmit={paymentHandler}>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name on card
                  </label>
                  <input
                    type="text"
                    placeholder={user && user.name}
                    value={user && user.name}
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    readOnly
                  />
                </div>
                <div>
                  <label
                    htmlFor="expDate"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Exp Date
                  </label>
                  <CardExpiryElement
                    id="expDate"
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="cardNumber"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Card Number
                  </label>
                  <CardNumberElement
                    id="cardNumber"
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    CVV
                  </label>
                  <CardCvcElement
                    id="cvv"
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "#444",
                        },
                        empty: {
                          color: "#3a120a",
                          backgroundColor: "transparent",
                          "::placeholder": {
                            color: "#444",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="my-3 flex w-[150px] cursor-pointer items-center justify-center rounded-lg bg-[#f63b60] py-2.5 text-[18px] font-[600] text-[#fff]"
              >
                Submit
              </button>
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
}

export default PaymentInfo;
