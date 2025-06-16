"use client";

import SellerActivation from "@/components/ShopPages/SellerActivation";

export default function SellerActivationPage({ params }) {
  return <SellerActivation token={params.token} />;
}