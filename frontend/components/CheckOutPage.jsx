import { useEffect } from "react";
import CheckOut from "@/components/CheckOut/CheckOut";
import CheckOutSteps from "../components/CheckOut/CheckOutSteps";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

function CheckOutPage() {
  useEffect(() => {
    // Updated: window.scrollTo(0, 0); // Replaced with smooth scrolling for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []); // No changes to dependencies since there are none

  return (
    <div>
      <Header />
      <CheckOutSteps active={1} />
      <CheckOut />
      <Footer />
    </div>
  );
}

export default CheckOutPage;