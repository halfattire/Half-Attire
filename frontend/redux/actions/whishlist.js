import { addToWishlist, removeFromWishlist } from "../reducers/whishlist";

export const addToWishlistAction = (data) => (dispatch, getState) => {
  dispatch(addToWishlist(data));
  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
};

export const removeFromWishlistAction = (id) => (dispatch, getState) => {
  dispatch(removeFromWishlist(id));
  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  );
};