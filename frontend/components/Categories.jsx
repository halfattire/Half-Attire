  "use client";

  import { useRouter } from "next/navigation";
  import Image from "next/image";
  import { brandingData, categoriesData } from "../lib/data";
  import placehoderImg from "../public/assets/placeholder.png"

  function Categories() {
    const router = useRouter();

    const handleSubmit = (item) => {
      router.push(`/products?category=${item.title}`);
    };

    // Pre-filter categories to use local fallback if external URL fails
    const safeCategoriesData = categoriesData.map((item) => ({
      ...item,
      image_Url: item.image_Url && item.image_Url.startsWith("http") ? item.image_Url : item.image_Url, // No change needed for local paths
    }));

    return (
      <div className="my-12">
        {/* Branding products */}
        <div className="container mx-auto px-4 bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-md mb-12">
            {brandingData &&
              brandingData.map((item, index) => (
                <div className="flex items-start" key={index}>
                  {item.icon}
                  <div className="px-3">
                    <h3 className="font-bold text-sm md:text-base">{item.title}</h3>
                    <p className="text-xs md:text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {/* Product categories */}
        <div className="container mx-auto px-4 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-md">
            {safeCategoriesData.map((item) => (
              <div
                className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                key={item.id}
                onClick={() => handleSubmit(item)}
              >
                <h5 className="text-[18px] leading-[1.3]">{item.title}</h5>
                <Image
                  src={item.image_Url}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="w-[100px] object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", item.image_Url);
                    e.target.src = {placehoderImg}; // Fallback to local image
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  export default Categories;