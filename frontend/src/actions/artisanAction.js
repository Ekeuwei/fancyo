import axios from "axios";

import {
  LOGIN_ARTISAN_REQUEST,
  LOGIN_ARTISAN_SUCCESS,
  LOGIN_ARTISAN_FAIL,
  REGISTER_ARTISAN_REQUEST,
  REGISTER_ARTISAN_SUCCESS,
  REGISTER_ARTISAN_FAIL,
  LOAD_ARTISAN_REQUEST,
  LOAD_ARTISAN_SUCCESS,
  LOAD_ARTISAN_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  UPDATE_ARTISAN_REQUEST,
  UPDATE_ARTISAN_SUCCESS,
  UPDATE_ARTISAN_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  ALL_ARTISANS_REQUEST,
  ALL_ARTISANS_SUCCESS,
  ALL_ARTISANS_FAIL,
  ARTISAN_DETAILS_REQUEST,
  ARTISAN_DETAILS_SUCCESS,
  ARTISAN_DETAILS_FAIL,
  DELETE_ARTISAN_REQUEST,
  DELETE_ARTISAN_SUCCESS,
  DELETE_ARTISAN_FAIL,
  LOGOUT_ARTISAN_SUCCESS,
  LOGOUT_ARTISAN_FAIL,
  CLEAR_ERRORS,
  SAVE_PERSONAL_INFO,
  SAVE_CONTACT_INFO,
} from "../constants/artisanConstants";

// Login
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_ARTISAN_REQUEST });

    const config = {
      headers: { "content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "/api/v1/artisan/login",
      { email, password },
      config
    );

    dispatch({
      type: LOGIN_ARTISAN_SUCCESS,
      payload: data.artisan,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_ARTISAN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Register User
export const register = (artisanData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_ARTISAN_REQUEST });

    const config = {
      headers: { "content-Type": "multipart/form-data" },
    };

    const { data } = await axios.post(
      "/api/v1/artisan/register",
      artisanData,
      config
    );

    dispatch({
      type: REGISTER_ARTISAN_SUCCESS,
      payload: data.artisan,
    });
  } catch (error) {
    // console.log(error);
    dispatch({
      type: REGISTER_ARTISAN_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const savePersonalInfo = (data) => async (dispatch, getState) => {
  dispatch({
    type: SAVE_PERSONAL_INFO,
    payload: data,
  });
  // if(!data.firstName.length === 0)
  localStorage.setItem("personalInfo", JSON.stringify(data));
};

export const saveContactInfo = (data) => async (dispatch, getState) => {
  dispatch({
    type: SAVE_CONTACT_INFO,
    payload: data,
  });

  // if(!data.city.length === 0)
  localStorage.setItem("contactInfo", JSON.stringify(data));
};

// Update Profile
export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    const config = {
      headers: { "content-Type": "multipart/form-data" },
    };

    const { data } = await axios.put(
      "/api/v1/artisan/me/update",
      userData,
      config
    );

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Password
export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    const config = {
      headers: { "content-Type": "application/json" },
    };

    const { data } = await axios.put(
      "/api/v1/artisan/password/update",
      passwords,
      config
    );

    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    const config = {
      headers: { "content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "/api/v1/artisan/password/forgot",
      email,
      config
    );

    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Reset Password
export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST });

    const config = {
      headers: { "content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/artisan/password/reset/${token}`,
      passwords,
      config
    );

    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_ARTISAN_REQUEST });

    const { data } = await axios.get("/api/v1/artisan/me");

    dispatch({
      type: LOAD_ARTISAN_SUCCESS,
      payload: data.artisan,
    });
  } catch (error) {
    dispatch({
      type: LOAD_ARTISAN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Logout User
export const logout = () => async (dispatch) => {
  try {
    await axios.get("/api/v1/logout/artisan");

    dispatch({
      type: LOGOUT_ARTISAN_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: LOGOUT_ARTISAN_FAIL,
      payload: error.response.data.message,
    });
  }
};

//Get All Artisans
export const getArtisans =
  (keyword = "", currentPage = 1, price, category, ratings = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_ARTISANS_REQUEST });

      let link = `/api/v1/artisans?keyword=${keyword}&page=${currentPage}
                    &price[lte]=${price[1]}&price[gte]=${price[0]}&ratings[gte]=${ratings}`;

      if (category) {
        link = `/api/v1/artisans?keyword=${keyword}&page=${currentPage}
                    &price[lte]=${price[1]}&price[gte]=${price[0]}&category=${category}&ratings[gte]=${ratings}`;
      }
      const { data } = await axios.get(link);

      dispatch({
        type: ALL_ARTISANS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_ARTISANS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// Get Artisan Details
export const getArtisanDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: ARTISAN_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/artisan/${id}`);

    dispatch({
      type: ARTISAN_DETAILS_SUCCESS,
      payload: data.artisan,
    });
  } catch (error) {
    dispatch({
      type: ARTISAN_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get All Users (Admin)
export const allUsers = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_ARTISANS_REQUEST });

    const { data } = await axios.get("/api/v1/artisan/admin/users");

    dispatch({
      type: ALL_ARTISANS_SUCCESS,
      payload: data.artisans,
    });
  } catch (error) {
    dispatch({
      type: ALL_ARTISANS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update user (Admin)
export const updateUser = (id, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_ARTISAN_REQUEST });

    const config = {
      headers: { "content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/artisan/admin/user/${id}`,
      userData,
      config
    );

    dispatch({
      type: UPDATE_ARTISAN_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_ARTISAN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Delete user (Admin)
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ARTISAN_REQUEST });

    const { data } = await axios.delete(`/api/v1/artisan/admin/user/${id}`);

    dispatch({
      type: DELETE_ARTISAN_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_ARTISAN_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
