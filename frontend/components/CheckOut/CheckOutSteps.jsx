import { FaShippingFast, FaCreditCard, FaCheckCircle } from "react-icons/fa";

function CheckOutSteps({ active }) {
  return (
    <div>
      <div className="hidden md:block">
        <div className="flex w-full justify-center p-4 sm:p-6">
          <div className="flex w-full items-center justify-center">
            <div className="flex items-center">
              <div className="flex h-[38px] cursor-pointer items-center justify-center rounded-[20px] bg-[#f63b60] px-4 sm:px-[20px]">
                <span className="text-[16px] text-sm font-[600] text-[#fff] sm:text-base">
                  1.Shipping
                </span>
              </div>
              <div
                className={`${
                  active > 1
                    ? "h-[4px] bg-[#f63b60] w-[120px]"
                    : "h-[4px] bg-[#FDE1E6] w-[120px]"
                }`}
              />
            </div>

            <div className="flex items-center">
              <div
                className={`${active > 1 ? `flex h-[38px] cursor-pointer items-center justify-center rounded-[20px] bg-[#f63b60] px-4 sm:px-[20px]` : `flex h-[38px] cursor-pointer items-center justify-center rounded-[20px] !bg-[#FDE1E6] px-4 sm:px-[20px]`}`}
              >
                <span
                  className={`${active > 1 ? `text-[16px] text-sm font-[600] text-[#fff] sm:text-base` : `text-[16px] text-sm font-[600] !text-[#f63b60] sm:text-base`}`}
                >
                  2.Payment
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div
                className={`${
                  active === 3
                     ? "h-[4px] bg-[#f63b60] w-[120px]"
                    : "h-[4px] bg-[#FDE1E6] w-[120px]"
                }`}
              />
              <div
                className={`${active > 2 ? `flex h-[38px] cursor-pointer items-center justify-center rounded-[20px] bg-[#f63b60] px-4 sm:px-[20px]` : `flex h-[38px] cursor-pointer items-center justify-center rounded-[20px] !bg-[#FDE1E6] px-4 sm:px-[20px]`}`}
              >
                <span
                  className={`${active > 2 ? `text-[16px] text-sm font-[600] text-[#fff] sm:text-base` : `text-[16px] text-sm font-[600] !text-[#f63b60] sm:text-base`}`}
                >
                  3.Success
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* mobile steps */}
      <div className="block md:hidden">
        <div className="flex w-full justify-center p-4 sm:p-6">
          <div className="flex w-full items-center justify-center">
            <div className="flex items-center">
              <div
                className={`${
                  active > 1
                    ? "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-[#f63b60]"
                    : "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-[#FDE1E6]"
                }`}
              >
                <FaShippingFast
                  className={`${active > 1 ? "text-white" : "#f63b60"} text-lg`}
                />
              </div>
              <div
                className={`${
                  active > 1
                    ? "h-[4px] w-[60px] bg-[#f63b60] sm:w-[140px]"
                    : "h-[4px] w-[60px] bg-[#FDE1E6] sm:w-[140px]"
                }`}
              />
            </div>

            <div className="flex items-center">
              <div
                className={`${
                  active > 1
                    ? "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-[#f63b60]"
                    : "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-[#FDE1E6]"
                }`}
              >
                <FaCreditCard
                  className={`${active > 1 ? "text-white" : "#f63b60"} text-lg`}
                />
              </div>
              <div
                className={`${
                  active > 2
                    ? "h-[4px] w-[60px] bg-[#f63b60] sm:w-[140px]"
                    : "h-[4px] w-[60px] bg-[#FDE1E6] sm:w-[140px]"
                }`}
              />
            </div>

            <div className="flex items-center">
              <div
                className={`${
                  active > 2
                    ? "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-[#f63b60]"
                    : "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-full bg-[#FDE1E6]"
                }`}
              >
                <FaCheckCircle
                  className={`${active > 2 ? "text-white" : "#f63b60"} text-lg`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckOutSteps;
