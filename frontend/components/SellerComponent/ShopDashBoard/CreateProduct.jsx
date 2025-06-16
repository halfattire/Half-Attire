"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { categoriesData } from "../../../lib/data"
import { FaPlus, FaTrash } from "react-icons/fa6"
import { toast } from "react-toastify"
import { clearErrors, resetProductState } from "../../../redux/reducers/product"
import { createProduct } from "../../../redux/actions/product"
import Image from "next/image"

function CreateProduct() {
  const { seller } = useSelector((state) => state.seller)
  const { success, error } = useSelector((state) => state.products)
  const router = useRouter()
  const dispatch = useDispatch()

  // Existing state - keep unchanged
  const [images, setImages] = useState([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPrice, setDiscountPrice] = useState("")
  const [stock, setStock] = useState("")

  // New state for variations - minimal addition
  const [isVariableProduct, setIsVariableProduct] = useState(false)
  const [variations, setVariations] = useState([{ id: Date.now(), size: "", color: "", price: "", stock: "" }])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (success) {
      toast.success("Product created successfully")
      dispatch(resetProductState())
      setIsLoading(false)
      router.push("/dashboard")
    }
  }, [success, router, dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearErrors())
      setIsLoading(false)
    }
  }, [error, dispatch])

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files))
  }

  // Variation handlers - minimal addition
  const handleVariationChange = (id, field, value) => {
    setVariations(variations.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
  }

  const addVariation = () => {
    setVariations([
      ...variations,
      {
        id: Date.now(),
        size: "",
        color: "",
        price: "",
        stock: "",
      },
    ])
  }

  const removeVariation = (id) => {
    if (variations.length > 1) {
      setVariations(variations.filter((v) => v.id !== id))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    const newForm = new FormData()
    images.forEach((image) => {
      newForm.append("images", image)
    })
    newForm.append("name", name)
    newForm.append("description", description)
    newForm.append("category", category)
    newForm.append("tags", tags)
    newForm.append("shopId", seller._id)

    if (isVariableProduct) {
      newForm.append("isVariableProduct", "true")
      newForm.append("variations", JSON.stringify(variations))
      // For variable products, use dummy values for required fields
      newForm.append("originalPrice", "0")
      newForm.append("discountPrice", "0")
      newForm.append("stock", "0")
    } else {
      newForm.append("isVariableProduct", "false")
      newForm.append("originalPrice", originalPrice)
      newForm.append("discountPrice", discountPrice)
      newForm.append("stock", stock)
    }

    dispatch(createProduct(newForm))
  }

  return (
    <section className="bg-gray-50 sm:py-4 dark:bg-gray-900">
      <div className="mx-auto flex h-[90vh] flex-col items-center justify-center overflow-y-auto px-2 py-2 sm:px-6 sm:py-8 md:h-[80vh] lg:py-0">
        <div className="custom-scrollbar w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create Product
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Product Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter the product name"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Enter the product description"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categoriesData.map((cat) => (
                    <option key={cat.id} value={cat.title}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  required
                  placeholder="Enter product tags"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                />
              </div>

              {/* NEW: Variable Product Checkbox - minimal addition */}
              <div className="flex items-center">
                <input
                  id="variable-product"
                  type="checkbox"
                  checked={isVariableProduct}
                  onChange={(e) => setIsVariableProduct(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="variable-product" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Variable Product (has size, color variations)
                </label>
              </div>

              {/* Conditional rendering - keep original fields for simple products */}
              {!isVariableProduct ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      required
                      placeholder="Enter the original price"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Price (With Discount)
                    </label>
                    <input
                      type="number"
                      value={discountPrice}
                      onChange={(e) => setDiscountPrice(e.target.value)}
                      required
                      placeholder="Enter the price after discount"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Stock</label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      required
                      placeholder="Enter the stock quantity"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-blue-600 focus:ring-blue-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    />
                  </div>
                </>
              ) : (
                /* NEW: Variations section - only shows when checkbox is checked */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Variations</h3>
                    <button
                      type="button"
                      onClick={addVariation}
                      className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      <FaPlus size={12} />
                      Add Variation
                    </button>
                  </div>

                  {variations.map((variation, index) => (
                    <div key={variation.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Variation {index + 1}</h4>
                        {variations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariation(variation.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-900">Size</label>
                          <input
                            type="text"
                            value={variation.size}
                            onChange={(e) => handleVariationChange(variation.id, "size", e.target.value)}
                            placeholder="e.g., S, M, L, XL"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-900">Color</label>
                          <input
                            type="text"
                            value={variation.color}
                            onChange={(e) => handleVariationChange(variation.id, "color", e.target.value)}
                            placeholder="e.g., Red, Blue, Green"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-900">Price</label>
                          <input
                            type="number"
                            value={variation.price}
                            onChange={(e) => handleVariationChange(variation.id, "price", e.target.value)}
                            placeholder="Enter price"
                            required
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-sm font-medium text-gray-900">Stock</label>
                          <input
                            type="number"
                            value={variation.stock}
                            onChange={(e) => handleVariationChange(variation.id, "stock", e.target.value)}
                            placeholder="Enter stock"
                            required
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-600 focus:ring-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="rounded-full border-2 border-black p-1">
                  <FaPlus size={14} />
                </div>
                <label
                  htmlFor="upload"
                  className="block cursor-pointer rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Upload Images
                </label>
                <input type="file" multiple onChange={handleImageChange} hidden id="upload" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {images &&
                  images.map((image, index) => (
                    <div key={index} className="h-20 w-20 overflow-hidden rounded-md">
                      <Image
                        src={URL.createObjectURL(image) || "/placeholder.svg"}
                        alt="product"
                        className="h-full w-full object-cover"
                        width={80}
                        height={80}
                      />
                    </div>
                  ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-lg py-2 text-white flex items-center justify-center gap-2 ${
                  isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Product...
                  </>
                ) : (
                  "Create Product"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateProduct
