"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

// Props:
// - categoriesData: Array of objects with id, title, image_Url
// - setDropDown: Function to close the dropdown
function DropDown({ categoriesData, setDropDown }) {
  const router = useRouter();

  const handleSubmit = (item) => {
    router.push(`/products?category=${item.title}`);
    setDropDown(false);
    // Removed window.location.reload() to avoid full page refresh
  };

  return (
    <div className="pb-4 md:w-[190px] lg:w-[270px] bg-white absolute top-[72px] z-30 rounded-b-md shadow-sm overflow-y-auto">
      {categoriesData &&
        categoriesData.map((item, index) => (
          <div
            key={index}
            className="flex items-center cursor-pointer hover:bg-gray-100"
            onClick={() => handleSubmit(item)}
          >
            <Image
              src={item.image_Url || "/assets/placeholder.png"}
              className="w-6 h-6 object-contain ml-2.5 select-none"
              alt={item.title || "Category"}
              width={24}
              height={24}
            />
            <h3 className="m-3 select-none">{item.title}</h3>
          </div>
        ))}
    </div>
  );
}

export default DropDown;