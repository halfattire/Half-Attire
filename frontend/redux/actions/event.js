import axios from "axios";
import { server } from "../../lib/server";
import {
  createEventFail,
  createEventRequest,
  createEventSuccess,
  deleteEventFailed,
  deleteEventRequest,
  deleteEventSuccess,
  getAlleventsFailed,
  getAlleventsRequest,
  getAllEventsShopFailed,
  getAllEventsShopRequest,
  getAllEventsShopSuccess,
  getAlleventsSuccess,
  adminAllEventsRequest,
  adminAllEventsSuccess,
  adminAllEventsFailed,
} from "../reducers/event";

// Create event (Seller functionality)
export const createEvent = (eventData) => async (dispatch) => {
  try {
    dispatch(createEventRequest());

    const { data } = await axios.post(
      `${server}/event/create-event`,
      eventData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );

    dispatch(createEventSuccess(data.event));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(createEventFail(errorMessage));
  }
};

// Action to get all events for a shop (Seller functionality)
export const getAllShopEvents = (id) => async (dispatch) => {
  try {
    dispatch(getAllEventsShopRequest());

    const { data } = await axios.get(`${server}/event/get-all-shop-events/${id}`);

    dispatch(getAllEventsShopSuccess(data.events));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(getAllEventsShopFailed(errorMessage));
  }
};

// Action to delete event for a shop (Seller functionality)
export const deleteShopEvent = (id) => async (dispatch) => {
  try {
    dispatch(deleteEventRequest());

    const { data } = await axios.delete(`${server}/event/delete-shop-event/${id}`, { withCredentials: true });

    dispatch(deleteEventSuccess(data.message));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(deleteEventFailed(errorMessage));
  }
};

// Action to get all events (Seller functionality)
export const getAllEvents = () => async (dispatch) => {
  try {
    dispatch(getAlleventsRequest());

    const { data } = await axios.get(`${server}/event/get-all-events`);

    dispatch(getAlleventsSuccess(data.events));
  } catch (error) {
    const errorMessage = error.response?.data?.message || "An error occurred";
    dispatch(getAlleventsFailed(errorMessage));
  }
};

// Action to get all events for admin (Admin functionality)
export const getAllEventsAdmin = () => async (dispatch) => {
  try {
    dispatch(adminAllEventsRequest());

    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const { data } = await axios.get(`${server}/event/admin-all-events`, config);

    dispatch(adminAllEventsSuccess(data.events));
    return data.events;
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch admin events";
    dispatch(adminAllEventsFailed(errorMessage));
    return [];
  }
};

// Action to delete event (Admin functionality)
export const deleteEventAdmin = (id) => async (dispatch) => {
  try {
    dispatch(deleteEventRequest());

    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    const config = {
      withCredentials: true,
    };

    // Add Authorization header if token exists
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    const { data } = await axios.delete(`${server}/event/admin-delete-event/${id}`, config);

    dispatch(deleteEventSuccess(data.message));
    return { success: true, message: data.message };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete event";
    dispatch(deleteEventFailed(errorMessage));
    return { success: false, error: errorMessage };
  }
};