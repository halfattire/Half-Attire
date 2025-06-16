"use client"
import { useEffect } from "react";
import CheckOutSteps from "@/components/CheckOut/CheckOutSteps";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Payment from "@/components/Payment/Payment";

function PaymentPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  }, []);

  return (
    <div>
      <Header />
      <CheckOutSteps active={2} />
      <Payment />
      <div className="my-12 md:my-20"></div>
      <Footer />
    </div>
  );
}

export default PaymentPage;