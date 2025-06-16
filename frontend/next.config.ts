/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com", pathname: "**" },
      { protocol: "https", hostname: "indian-retailer.s3.ap-south-1.amazonaws.com", pathname: "**" },
      { protocol: "https", hostname: "www.shift4shop.com", pathname: "**" },
      { protocol: "https", hostname: "img.freepik.com", pathname: "**" },
      { protocol: "https", hostname: "encrypted-tbn0.gstatic.com", pathname: "**" },
      { protocol: "https", hostname: "cdn-icons-png.flaticon.com", pathname: "**" },
      { protocol: "https", hostname: "st-troy.mncdn.com", pathname: "**" },
      { protocol: "https", hostname: "static.vecteezy.com", pathname: "**" },
      { protocol: "https", hostname: "searchspring.com", pathname: "**" },
      { protocol: "https", hostname: "m.media-amazon.com", pathname: "**" },
      { protocol: "https", hostname: "www.startech.com.bd", pathname: "**" },
      { protocol: "https", hostname: "www.hatchwise.com", pathname: "**" },
      { protocol: "https", hostname: "shopo.quomodothemes.website", pathname: "**" },
      { protocol: "https", hostname: "hamart-shop.vercel.app", pathname: "**" },
      { protocol: "https", hostname: "via.placeholder.com", pathname: "**" },
      { protocol: "https", hostname: "i5.walmartimages.com", pathname: "**" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "**" },
    ],
  },
};

export default nextConfig;
