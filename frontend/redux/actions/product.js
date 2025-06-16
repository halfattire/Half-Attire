import axios from "axios";
import { server } from "../../lib/server";
import {
  createProductFail,
  createProductRequest,
  createProductSuccess,
  deleteProductFailed,
  deleteProductRequest,
  deleteProductSuccess,
  getAllProductsFailed,
  getAllProductsRequest,
  getAllProductsShopFailed,
  getAllProductsShopRequest,
  getAllProductsShopSuccess,
  getAllProductsSuccess,
} from "../reducers/product";

export const createProduct = (formData) => async (dispatch) => {
  try {
    dispatch(createProductRequest());

    const { data } = await axios.post(
      `${server}/product/create-product`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );

    dispatch(createProductSuccess(data.product));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(createProductFail(errorMessage));
  }
};

// Action to get all products for a shop
export const getAllShopProducts = (id) => async (dispatch) => {
  try {
    dispatch(getAllProductsShopRequest());

    const { data } = await axios.get(
      `${server}/product/get-all-shop-products/${id}`,
    );

    dispatch(getAllProductsShopSuccess(data.products)); // Fix: should be data.products
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(getAllProductsShopFailed(errorMessage));
  }
};

// Action to delete product for a shop
export const deleteShopProducts = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());

    const { data } = await axios.delete(
      `${server}/product/delete-shop-products/${id}`,
      { withCredentials: true },
    );

    dispatch(deleteProductSuccess(data.message));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(deleteProductFailed(errorMessage));
  }
};

// Action to get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch(getAllProductsRequest());
    const { data } = await axios.get(`${server}/product/get-all-products`);
    // console.log("Fetched Products:", data.products);
    dispatch(getAllProductsSuccess(data.products));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(getAllProductsFailed(errorMessage));
  }
};
