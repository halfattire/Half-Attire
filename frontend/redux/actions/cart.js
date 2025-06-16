import { addToCart, removeFromCart, clearCart } from "../reducers/cart";

// Add to cart action
export const addTocartAction = (data) => (dispatch, getState) => {
  dispatch(addToCart(data));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
};

// Remove from cart action
export const removeFromCartAction = (id) => (dispatch, getState) => {
  dispatch(removeFromCart(id));
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
};

// Clear cart action
export const clearCartAction = () => (dispatch) => {
  dispatch(clearCart());
  localStorage.setItem("cartItems", JSON.stringify([]));
};