/* eslint-disable no-unused-vars */
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-toastify";

function PaymentInfo({
  user,
  open,
  setOpen,
  paymentHandler,
  cashOnDeliveryHandler,
}) {
  const [select, setSelect] = useState(1);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCardDetails = () => {
    const { cardNumber, expiryDate, cvv, cardHolderName } = cardDetails;
    
    if (!cardHolderName.trim()) {
      toast.error("Please enter card holder name");
      return false;
    }
    
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    
    if (!expiryDate.trim() || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      toast.error("Please enter expiry date in MM/YY format");
      return false;
    }
    
    if (!cvv.trim() || cvv.length !== 3) {
      toast.error("Please enter a valid 3-digit CVV");
      return false;
    }
    
    return true;
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

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
            Pay with Debit/Credit Card
          </h4>
        </div>

        {select === 1 && (
          <div className="flex w-full border-b">
            <form className="w-full" onSubmit={(e) => {
              e.preventDefault();
              if (validateCardDetails()) {
                // Handle manual card payment
                const cardPaymentData = {
                  cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
                  expiryDate: cardDetails.expiryDate,
                  cvv: cardDetails.cvv,
                  cardHolderName: cardDetails.cardHolderName,
                  type: "Credit/Debit Card"
                };
                
                // Call the manual card payment handler
                if (typeof paymentHandler === 'function') {
                  paymentHandler(e, cardPaymentData);
                }
              }
            }}>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    htmlFor="cardHolderName"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Card Holder Name
                  </label>
                  <input
                    type="text"
                    id="cardHolderName"
                    name="cardHolderName"
                    placeholder="Enter card holder name"
                    value={cardDetails.cardHolderName}
                    onChange={handleCardInputChange}
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="expiryDate"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Expiry Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    value={cardDetails.expiryDate}
                    onChange={(e) => {
                      const formatted = formatExpiryDate(e.target.value);
                      setCardDetails(prev => ({
                        ...prev,
                        expiryDate: formatted
                      }));
                    }}
                    maxLength="5"
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
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
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const formatted = formatCardNumber(e.target.value);
                      if (formatted.replace(/\s/g, '').length <= 16) {
                        setCardDetails(prev => ({
                          ...prev,
                          cardNumber: formatted
                        }));
                      }
                    }}
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="cvv"
                    className="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 3) {
                        setCardDetails(prev => ({
                          ...prev,
                          cvv: value
                        }));
                      }
                    }}
                    maxLength="3"
                    className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
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

        <br />

        {/* STRIPE OPTION - COMMENTED OUT BUT CODE PRESERVED */}
        {/*
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
              Pay with Stripe
            </h4>
          </div>

          {select === 2 && (
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
        </div>

        <br />
        */}

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