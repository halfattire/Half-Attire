"use client"
import { Truck, Clock, Package, RefreshCw, Shield, HelpCircle } from "lucide-react"
import { Fade } from "react-awesome-reveal"

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Fade triggerOnce direction="up" duration={800}>
        <div className="bg-gray-100 text-[#3321c8]">
          <div className="container mx-auto px-4 py-8 md:py-12 text-center">
            <div className="animate-float inline-block bg-[#3321c8]/10 p-3 rounded-full mb-4">
              <Truck className="h-8 w-8 text-[#3321c8]" />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-4 animate-fade-in">Shipping Policy</h1>
            <p className="text-sm md:text-base max-w-3xl mx-auto opacity-90 leading-relaxed">
              Everything you need to know about our delivery process and terms & conditions.
            </p>
          </div>
        </div>
      </Fade>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Shipping Overview */}
          <Fade triggerOnce direction="up" duration={800}>
            <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-500 hover:shadow-2xl">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="bg-[#3321c8]/10 p-3 rounded-full mb-4 animate-pulse-slow">
                  <Truck className="h-7 w-7 text-[#3321c8]" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">Free Shipping on All Orders</h2>
                <div className="h-1 w-16 bg-[#3321c8] rounded-full mb-4"></div>
                <p className="mt-2 text-gray-600 max-w-3xl text-sm">
                  At Half Attire, we're proud to offer{" "}
                  <span className="font-semibold text-[#3321c8]">free shipping</span> on all orders nationwide. We
                  strive to deliver your orders promptly and safely across Pakistan.
                </p>
              </div>
              <Fade triggerOnce cascade damping={0.2} direction="up">
                <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 transition-all duration-300 hover:border-[#3321c8] hover:shadow-lg transform hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-[#3321c8]/10 p-3 rounded-full mb-3 group-hover:bg-[#3321c8]/20 transition-all duration-300">
                        <Clock className="h-6 w-6 text-[#3321c8]" />
                      </div>
                      <h3 className="font-bold text-base mb-2">Processing Time</h3>
                      <p className="text-gray-700 text-sm">1-2 business days</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 transition-all duration-300 hover:border-[#3321c8] hover:shadow-lg transform hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-[#3321c8]/10 p-3 rounded-full mb-3 group-hover:bg-[#3321c8]/20 transition-all duration-300">
                        <Package className="h-6 w-6 text-[#3321c8]" />
                      </div>
                      <h3 className="font-bold text-base mb-2">Delivery Time</h3>
                      <p className="text-gray-700 text-sm">2-5 business days</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 transition-all duration-300 hover:border-[#3321c8] hover:shadow-lg transform hover:scale-105 group">
                    <div className="flex flex-col items-center text-center">
                      <div className="bg-[#3321c8]/10 p-3 rounded-full mb-3 group-hover:bg-[#3321c8]/20 transition-all duration-300">
                        <Shield className="h-6 w-6 text-[#3321c8]" />
                      </div>
                      <h3 className="font-bold text-base mb-2">Order Tracking</h3>
                      <p className="text-gray-700 text-sm">Available for all orders</p>
                    </div>
                  </div>
                </div>
              </Fade>
            </section>
          </Fade>

          {/* Terms & Conditions */}
          <Fade triggerOnce direction="up" duration={800}>
            <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-500 hover:shadow-2xl animate-slide-up">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="bg-[#3321c8]/10 p-3 rounded-full mb-4">
                  <HelpCircle className="h-7 w-7 text-[#3321c8]" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">Shipping Terms & Conditions</h2>
                <div className="h-1 w-16 bg-[#3321c8] rounded-full mb-4"></div>
              </div>
              <Fade triggerOnce cascade damping={0.2} direction="up">
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-[#3321c8] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg shadow-sm">
                    <h3 className="font-bold text-base mb-2">Order Processing</h3>
                    <p className="text-gray-700 text-sm">
                      All orders are processed within 1-2 business days. Orders placed after 2 PM will be processed the
                      next business day. Business days are Monday through Friday, excluding public holidays.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-[#3321c8] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg shadow-sm">
                    <h3 className="font-bold text-base mb-2">Shipping Carriers</h3>
                    <p className="text-gray-700 text-sm">
                      We use reliable shipping carriers including TCS, Leopards Courier, and M&P Express. The carrier
                      will be selected based on your location for optimal delivery speed.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-[#3321c8] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg shadow-sm">
                    <h3 className="font-bold text-base mb-2">Order Tracking</h3>
                    <p className="text-gray-700 text-sm">
                      Once your order ships, you will receive a tracking number via email and SMS. You can track your
                      order status through our website or directly through the carrier's website.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-[#3321c8] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg shadow-sm">
                    <h3 className="font-bold text-base mb-2">Shipping Delays</h3>
                    <p className="text-gray-700 text-sm">
                      Occasionally, there may be delays due to weather conditions, high volume periods, or other
                      unforeseen circumstances. We will notify you if there are any significant delays with your order.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-[#3321c8] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg shadow-sm">
                    <h3 className="font-bold text-base mb-2">Damaged Items</h3>
                    <p className="text-gray-700 text-sm">
                      If your package arrives damaged, please contact our customer service within 24 hours of delivery.
                      Take photos of the damaged package and products for our records.
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-[#3321c8] bg-gray-50 hover:bg-gray-100 transition-colors rounded-r-lg shadow-sm">
                    <h3 className="font-bold text-base mb-2">International Shipping</h3>
                    <p className="text-gray-700 text-sm">
                      Currently, we only ship within Pakistan. We plan to expand our shipping services internationally
                      in the future.
                    </p>
                  </div>
                </div>
              </Fade>
            </section>
          </Fade>

          {/* Returns & Exchanges */}
          <Fade triggerOnce direction="up" duration={800}>
            <section className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-500 hover:shadow-2xl animate-slide-up">
              <div className="flex flex-col items-center mb-6 text-center">
                <div className="bg-[#3321c8]/10 p-3 rounded-full mb-4">
                  <RefreshCw className="h-7 w-7 text-[#3321c8]" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-3">Returns & Exchanges</h2>
                <div className="h-1 w-16 bg-[#3321c8] rounded-full mb-4"></div>
                <p className="mb-4 text-gray-600 max-w-3xl text-sm">
                  We want you to be completely satisfied with your purchase. If you're not happy with your order, we
                  offer a simple returns and exchange policy.
                </p>
              </div>
              <Fade triggerOnce cascade damping={0.2} direction="up">
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-base mb-3 text-center text-[#3321c8]">Return Policy</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-xs">
                      <li>Returns must be initiated within 7 days of receiving your order</li>
                      <li>Items must be unworn, unwashed, and in their original packaging</li>
                      <li>Return shipping costs are the responsibility of the customer unless the item is defective</li>
                      <li>Refunds will be processed within 5-7 business days after we receive the returned items</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-base mb-3 text-center text-[#3321c8]">Exchange Policy</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-xs">
                      <li>Exchanges must be initiated within 7 days of receiving your order</li>
                      <li>We offer free shipping for exchanges due to size issues</li>
                      <li>Exchanges are subject to product availability</li>
                      <li>
                        If the exchanged item has a different price, you will be charged or refunded the difference
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                    <h3 className="font-bold text-base mb-3 text-center text-[#3321c8]">Non-Returnable Items</h3>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 text-xs">
                      <li>Sale items marked as "Final Sale"</li>
                      <li>Personalized or custom-made items</li>
                      <li>Intimate apparel for hygiene reasons</li>
                      <li>Gift cards</li>
                    </ul>
                  </div>
                </div>
              </Fade>
            </section>
          </Fade>
        </div>
      </div>
    </div>
  )
}
