"use client"

import { useState } from "react"
import { Search, PlusCircle, MinusCircle, HelpCircle, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Fade } from "react-awesome-reveal"

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // FAQ data
  const faqs = [
    {
      question: "How long does shipping take?",
      answer:
        "We offer free shipping on all orders nationwide. Most orders are delivered within 2-5 business days, depending on your location. Major cities typically receive orders faster than remote areas. You'll receive a tracking number once your order ships.",
    },
    {
      question: "What is your return policy?",
      answer:
        "Returns must be initiated within 7 days of receiving your order. Items must be unworn, unwashed, and in their original packaging. Return shipping costs are the responsibility of the customer unless the item is defective. Refunds will be processed within 5-7 business days after we receive the returned items.",
    },
    {
      question: "Do you offer exchanges?",
      answer:
        "Yes, we offer exchanges within 7 days of receiving your order. We provide free shipping for exchanges due to size issues. Exchanges are subject to product availability. If the exchanged item has a different price, you will be charged or refunded the difference.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once your order ships, you will receive a tracking number via email and SMS. You can track your order status through our website or directly through the carrier's website. If you haven't received tracking information within 2 business days of placing your order, please contact our customer service.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and digital payment methods including PayPal, Google Pay, and Apple Pay. We also offer cash on delivery (COD) for orders within Pakistan. All payments are processed securely through our encrypted payment gateway.",
    },
    {
      question: "How do I care for my Half Attire clothing?",
      answer:
        "Most Half Attire clothing items can be machine washed in cold water on a gentle cycle. We recommend turning garments inside out before washing and using mild detergent. Avoid using bleach or harsh chemicals. For best results, air dry your items or tumble dry on low heat. Always check the care label on each garment for specific instructions.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we only ship within Pakistan. We plan to expand our shipping services internationally in the future. Sign up for our newsletter to be notified when international shipping becomes available.",
    },
    {
      question: "How can I contact customer service?",
      answer:
        "You can reach our customer service team by phone at 03155185557, by email at Halfattire.pk@gmail.com, or through WhatsApp. Our business hours are Monday to Saturday from 10am to 6pm. We typically respond to all inquiries within 24 hours.",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Toggle FAQ item
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <section className="relative overflow-hidden bg-gray-100 py-16">
      {/* Background elements */}
      <div className="absolute -left-20 top-40 h-[400px] w-[400px] rounded-full bg-[#3321c8]/5 blur-3xl" />
      <div className="absolute -right-20 bottom-40 h-[300px] w-[300px] rounded-full bg-[#3321c8]/5 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <Fade triggerOnce direction="up" duration={800}>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-800 md:text-3xl">
              Frequently Asked <span className="text-[#3321c8]">Questions</span>
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600">
              Find answers to common questions about shopping with Half Attire.
            </p>
          </div>

          {/* Search bar */}
          <div className="mx-auto mb-10 max-w-2xl">
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[#3321c8]">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search for questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-[#3321c8] focus:shadow-lg focus:shadow-[#3321c8]/10"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="sr-only">Clear search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        </Fade>

        {/* FAQ items */}
        <div className="mx-auto max-w-3xl">
          {filteredFaqs.length > 0 ? (
            <Fade triggerOnce cascade damping={0.1} direction="up">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group mb-4 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    activeIndex === index
                      ? "border-[#3321c8] bg-white shadow-lg shadow-[#3321c8]/10"
                      : "border-gray-200 bg-white hover:border-[#3321c8]/50"
                  }`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                          activeIndex === index
                            ? "bg-[#3321c8] text-white"
                            : "bg-gray-100 text-gray-500 group-hover:bg-[#3321c8]/10 group-hover:text-[#3321c8]"
                        }`}
                      >
                        {activeIndex === index ? (
                          <MinusCircle className="h-4 w-4" />
                        ) : (
                          <PlusCircle className="h-4 w-4" />
                        )}
                      </div>
                      <h3
                        className={`text-sm font-medium transition-colors duration-300 ${
                          activeIndex === index ? "text-[#3321c8]" : "text-gray-700 group-hover:text-[#3321c8]"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <div className={`transition-transform duration-300 ${activeIndex === index ? "rotate-180" : ""}`}>
                      <ChevronDown
                        className={`h-4 w-4 transition-colors duration-300 ${
                          activeIndex === index ? "text-[#3321c8]" : "text-gray-400 group-hover:text-[#3321c8]"
                        }`}
                      />
                    </div>
                  </button>

                  {activeIndex === index && (
                    <div className="px-4 pb-4">
                      <div className="relative ml-10 border-l-2 border-dashed border-[#3321c8]/30 pl-4">
                        <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-[#3321c8]/20" />
                        <p className="text-xs text-gray-600">{faq.answer}</p>
                        <div className="absolute -left-[5px] bottom-0 h-2.5 w-2.5 rounded-full bg-[#3321c8]/20" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Fade>
          ) : (
            <Fade triggerOnce direction="up">
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3321c8]/10">
                  <HelpCircle className="h-6 w-6 text-[#3321c8]" />
                </div>
                <h3 className="mb-2 text-base font-medium text-gray-700">No results found</h3>
                <p className="text-sm text-gray-500">
                  We couldn't find any FAQs matching your search. Try different keywords or browse all questions.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#3321c8] px-4 py-2 text-xs text-white transition-all duration-300 hover:bg-[#2a1ba3]"
                >
                  <span>View all questions</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </Fade>
          )}
        </div>

        {/* Still have questions */}
        <Fade triggerOnce direction="up" delay={200}>
          <div className="mx-auto mt-12 max-w-3xl rounded-xl bg-gradient-to-r from-[#3321c8]/5 to-[#3321c8]/10 p-6 text-center">
            <div className="relative mx-auto mb-4 h-12 w-12 overflow-hidden rounded-full">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#3321c8] opacity-20" />
              <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white">
                <HelpCircle className="h-6 w-6 text-[#3321c8]" />
              </div>
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-700">Still have questions?</h3>
            <p className="mb-4 text-xs text-gray-600">
              Our dedicated support team is here to help you with any questions you may have about shopping with Half
              Attire.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact">
                <button className="group relative overflow-hidden rounded-full bg-[#3321c8] px-5 py-2 text-xs text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#3321c8]/20">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Contact Support
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                  <span className="absolute bottom-0 left-0 h-full w-0 bg-[#2a1ba3] transition-all duration-300 group-hover:w-full" />
                </button>
              </Link>
            </div>
          </div>
        </Fade>
      </div>

      {/* Floating elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
        <div
          className="absolute -left-20 bottom-40 h-40 w-40 rounded-full border-2 border-[#3321c8]/10"
          style={{ animation: "float 15s infinite ease-in-out" }}
        />
        <div
          className="absolute -right-10 top-20 h-20 w-20 rounded-full border-2 border-[#3321c8]/10"
          style={{ animation: "float 12s infinite ease-in-out 1s" }}
        />
        <div
          className="absolute left-1/4 top-1/3 h-6 w-6 rounded-full bg-[#3321c8]/10"
          style={{ animation: "float 8s infinite ease-in-out 0.5s" }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 h-8 w-8 rounded-full bg-[#3321c8]/10"
          style={{ animation: "float 10s infinite ease-in-out 0.2s" }}
        />
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }
      `}</style>
    </section>
  )
}
