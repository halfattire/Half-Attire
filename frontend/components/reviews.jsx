"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, ArrowRight, Quote } from "lucide-react"
import { Fade } from "react-awesome-reveal"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef(null)

  const testimonials = [
    {
      name: "Sarah Ahmed",
      role: "Loyal Customer",
      content:
        "Half Attire has completely transformed my wardrobe! The quality of their clothing is exceptional, and the styles are always on trend. I've received countless compliments on their pieces. The free shipping is a great bonus too!",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Shafiq Ur Rehman",
      role: "Fashion Enthusiast",
      content:
        "I'm extremely impressed with the attention to detail in every garment from Half Attire. The fabrics are comfortable, the stitching is perfect, and the designs are unique. Their customer service is also top-notch!",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Ayesha Malik",
      role: "Regular Shopper",
      content:
        "Half Attire offers the perfect balance of style, comfort, and affordability. I've been shopping with them for over a year now, and I've never been disappointed. Their clothes hold up well even after multiple washes.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Hassan Ali",
      role: "First-time Buyer",
      content:
        "My first order from Half Attire exceeded all my expectations! The delivery was quick, the packaging was beautiful, and the clothes fit perfectly. I'll definitely be a repeat customer from now on.",
      avatar: "/placeholder.svg?height=80&width=80",
    },
  ]

  const scrollPrev = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
    if (isAutoPlaying) {
      clearInterval(autoPlayRef.current)
      setIsAutoPlaying(false)
    }
  }, [testimonials.length, isAutoPlaying])

  const scrollNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    if (isAutoPlaying) {
      clearInterval(autoPlayRef.current)
      setIsAutoPlaying(false)
    }
  }, [testimonials.length, isAutoPlaying])

  // Handle autoplay
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
      }, 5000)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, testimonials.length])

  // Calculate visible testimonials based on screen size
  const getVisibleCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth >= 1280) return 3
      if (window.innerWidth >= 768) return 2
      return 1
    }
    return 1
  }

  const [visibleCount, setVisibleCount] = useState(1)

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount())
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Get visible testimonials
  const getVisibleTestimonials = () => {
    const result = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  const visibleTestimonials = getVisibleTestimonials()

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -left-20 top-40 h-[400px] w-[400px] rounded-full bg-[#3321c8]/5 blur-3xl" />
        <div className="absolute -right-20 bottom-40 h-[300px] w-[300px] rounded-full bg-[#3321c8]/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-[200px] w-[200px] rounded-full bg-[#3321c8]/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        {/* Section header */}
        <Fade triggerOnce direction="up" duration={800}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3321c8]/10 mb-4">
              <Quote className="text-[#3321c8] w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-[#3321c8]">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover why our customers love shopping with Half Attire. Read their experiences and feedback.
            </p>
          </div>
        </Fade>

        {/* Testimonials carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <Fade triggerOnce cascade damping={0.2} direction="up">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-500">
                {visibleTestimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group h-full flex flex-col"
                  >
                    <div className="mb-6 text-[#3321c8]/20">
                      <Quote className="w-8 h-8 text-[#3321c8]" />
                    </div>

                    <p className="text-gray-700 mb-6 flex-grow leading-relaxed">"{testimonial.content}"</p>

                    <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-[#3321c8]/10 flex items-center justify-center group-hover:bg-[#3321c8]/20 transition-colors duration-300">
                          <span className="text-[#3321c8] font-bold">
                            {testimonial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Fade>
          </div>

          {/* Navigation controls */}
          <Fade triggerOnce direction="up" delay={200}>
            <div className="flex justify-center mt-10 gap-4">
              <button
                onClick={scrollPrev}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-[#3321c8] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#3321c8]/50"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* Pagination indicators */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      if (isAutoPlaying) {
                        clearInterval(autoPlayRef.current)
                        setIsAutoPlaying(false)
                      }
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                      idx === currentIndex ? "bg-[#3321c8] w-6" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={scrollNext}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-[#3321c8] hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#3321c8]/50"
                aria-label="Next testimonial"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  )
}
