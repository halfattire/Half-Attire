"use client";

import ActivationUser from "@/components/ActivationUser";

export default function ActivationUserPage({ params }) {
  return <ActivationUser activation_token={params.activation_token} />;
}