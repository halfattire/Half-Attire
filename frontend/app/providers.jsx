"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "../redux/store";
import store from "../redux/store";
import { loadSeller, loadUser } from "@/redux/actions/user";
import { loadUserSuccess } from "@/redux/reducers/user";
import { initializeAuth } from "@/lib/auth-persistence";
import { getAllProducts } from "@/redux/actions/product";
import { getAllEvents } from "@/redux/actions/event";
import { useEffect, useState } from "react";
import axios from "axios";
import { server } from "@/lib/server";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer } from "react-toastify"; 
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }) {
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    try {
      const { data } = await axios.get(`${server}/payment/stripeapikey`);
      setStripeApiKey(data.stripeApiKey);
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
    }
  }

  useEffect(() => {
    // Load initial data and authenticate user
    const initializeApp = async () => {
      try {
        // Initialize authentication from persisted state
        const userData = initializeAuth();
        
        if (userData) {
          // Load user data into Redux if found in storage
          store.dispatch(loadUserSuccess(userData));
        } else {
          // Try to load user from backend if no local data
          store.dispatch(loadUser());
        }
        
        // Load application data
        store.dispatch(getAllProducts());
        store.dispatch(getAllEvents());
        
      } catch (error) {
        // Error initializing app
      }
    };

    initializeApp();
    getStripeApiKey();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {stripeApiKey ? (
          <Elements stripe={loadStripe(stripeApiKey)}>
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
            {children}
          </Elements>
        ) : (
          <>
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
            {children}
          </>
        )}
      </PersistGate>
    </Provider>
  );
}