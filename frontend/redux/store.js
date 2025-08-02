
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import userReducer from "@/redux/reducers/user";
import sellerReducer from "@/redux/reducers/seller";
import productReducer from "@/redux/reducers/product";
import eventReducer from "@/redux/reducers/event";
import cartReducer from "@/redux/reducers/cart";
import wishlistReducer from "../redux/reducers/whishlist";
import { orderReducer } from "@/redux/reducers/order";
import { withdrawReducer } from "@/redux/reducers/withdraw";

// Create a custom storage engine to handle SSR
const createWebStorage = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== "undefined";

  if (isBrowser) {
    // Use localStorage if we're in the browser
    return {
      getItem: async (key) => window.localStorage.getItem(key),
      setItem: async (key, value) => window.localStorage.setItem(key, value),
      removeItem: async (key) => window.localStorage.removeItem(key),
    };
  } else {
    // Fallback to a noop storage for SSR
    return {
      getItem: async () => null,
      setItem: async () => undefined,
      removeItem: async () => undefined,
    };
  }
};

// Use the custom storage engine
const storage = createWebStorage();

const rootReducer = combineReducers({
  user: userReducer,
  seller: sellerReducer,
  products: productReducer,
  events: eventReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  orders: orderReducer, 
  withdraws: withdrawReducer,
});

const persistConfig = {
  key: "root",
  storage, // Use the custom storage
  whitelist: ['user', 'cart', 'wishlist'], // Only persist these reducers
  timeout: 10000, // 10 second timeout for rehydration
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});


// persistStore() - by default redux lose the state on page refresh, does three things:

// Tracks changes in the Redux state
// Saves state to persistent storage (e.g., localStorage for web)
// Restores saved state when the app starts again

export const persistor = persistStore(store);
export default store;