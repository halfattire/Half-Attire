"use client"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useSearchParams } from "next/navigation"
import Footer from "@/components/Footer"
import Header from "@/components/Header"
import NewsLetter from "@/components/NewsLetter"
import ProductDetail from "@/components/ProductDetail"
import SuggestedProducts from "@/components/SuggestedProducts"
import Loader from "@/components/Loader"

function ProductDetails({ id }) {
  const { allProducts, isLoading } = useSelector((state) => state.products) || {}
  const { allEvents } = useSelector((state) => state.events) || {}
  const [product, setProduct] = useState(null)
  const searchParams = useSearchParams()
  const eventData = searchParams.get("isEvent")

  useEffect(() => {
    if (!id) return // Guard against invalid id

    if (eventData !== null) {
      const foundProduct = allEvents?.find((product) => product._id === id)
      setProduct(foundProduct || null)
    } else {
      const foundProduct = allProducts?.find((product) => product._id === id)
      setProduct(foundProduct || null)
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [id, allProducts, allEvents, eventData])

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <Header />
      {product ? (
        <>
          <ProductDetail data={product} />
          {eventData === null && <SuggestedProducts data={product} />}
        </>
      ) : (
        <h1 className="p-6 text-center">Product not found!</h1>
      )}
      <NewsLetter />
      <Footer />
    </div>
  )
}

export default ProductDetails