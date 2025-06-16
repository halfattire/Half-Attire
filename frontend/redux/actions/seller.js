import { server } from "../../lib/server"
import axios from "axios"
import {
  loadSellerRequest,
  loadSellerSuccess,
  loadSellerFail,
  getAllSellerRequest,
  getAllSellerSuccess,
  getAllSellerFailed,
} from "../reducers/seller"

// getSeller - KEEPING EXISTING FUNCTION NAME
export const getSeller = () => async (dispatch) => {
  try {
    dispatch(loadSellerRequest())
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    })
    dispatch(loadSellerSuccess(data.seller))
  } catch (error) {
    dispatch(loadSellerFail(error.response?.data?.message || "Failed to load seller"))
  }
}

// get all sellers --- admin - KEEPING EXISTING FUNCTION NAME
export const getAllSellers = () => async (dispatch) => {
  try {
    dispatch(getAllSellerRequest())

    const { data } = await axios.get(`${server}/shop/admin-all-sellers`, {
      withCredentials: true,
    })

    dispatch(getAllSellerSuccess(data.sellers))
  } catch (error) {
    console.error("Sellers fetch error:", error)
    dispatch(getAllSellerFailed(error.response?.data?.message || "Failed to fetch sellers"))
  }
}

