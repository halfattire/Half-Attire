"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../redux/store";
import store from "../redux/store";
import { loadSeller } from "@/redux/actions/user";
import { loadUserSuccess } from "@/redux/reducers/user";
import { getAllProducts } from "@/redux/actions/product";
import { getAllEvents } from "@/redux/actions/event";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "@/lib/server";
// Stripe imports commented out since we're not using Stripe
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify"; 
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import AuthInitializer from "@/components/AuthInitializer";

export function Providers({ children }) {
  // Stripe API key state commented out since we're not using Stripe
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKey() {
  //   try {
  //     const { data } = await axios.get(`${server}/payment/stripeapikey`);
  //     setStripeApiKey(data.stripeApiKey);
  //   } catch (error) {
  //     console.error("Error fetching Stripe API key:", error);
  //   }
  // }

  useEffect(() => {
    // Load application data
    const loadAppData = async () => {
      try {
        store.dispatch(getAllProducts());
        store.dispatch(getAllEvents());
        
        // Load seller authentication if seller token exists
        const sellerToken = localStorage.getItem("seller_token");
        if (sellerToken) {
          store.dispatch(loadSeller());
        }
        
        // Stripe API key loading commented out
        // await getStripeApiKey();
      } catch (error) {
        console.error("Error loading app data:", error);
      }
    };

    loadAppData();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Removed Stripe Elements wrapper since we're not using Stripe */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <AuthInitializer>
          {children}
        </AuthInitializer>
      </PersistGate>
    </Provider>
  );
}