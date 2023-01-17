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
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_FAIL,
  DELETE_ARTISAN_REQUEST,
  DELETE_ARTISAN_SUCCESS,
  DELETE_ARTISAN_RESET,
  DELETE_ARTISAN_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_RESET,
  UPDATE_PASSWORD_FAIL,
  UPDATE_ARTISAN_REQUEST,
  UPDATE_ARTISAN_SUCCESS,
  UPDATE_ARTISAN_RESET,
  UPDATE_ARTISAN_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  ARTISAN_DETAILS_REQUEST,
  ARTISAN_DETAILS_SUCCESS,
  ARTISAN_DETAILS_FAIL,
  ALL_ARTISANS_REQUEST,
  ALL_ARTISANS_SUCCESS,
  ALL_ARTISANS_FAIL,
  LOGOUT_ARTISAN_SUCCESS,
  LOGOUT_ARTISAN_FAIL,
  CLEAR_ERRORS,
} from "../constants/artisanConstants";

export const authArtisanReducer = (state = { artisan: {} }, action) => {
  switch (action.type) {
    case REGISTER_ARTISAN_REQUEST:
    case LOGIN_ARTISAN_REQUEST:
    case LOAD_ARTISAN_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticatedArtisan: false,
      };

    case REGISTER_ARTISAN_SUCCESS:
    case LOGIN_ARTISAN_SUCCESS:
    case LOAD_ARTISAN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticatedArtisan: true,
        artisan: action.payload,
      };

    case LOGOUT_ARTISAN_SUCCESS:
      return {
        loading: false,
        isAuthenticatedArtisan: false,
        artisan: null,
      };

    case LOAD_ARTISAN_FAIL:
      return {
        loading: false,
        isAuthenticatedArtisan: false,
        artisan: null,
        error: action.payload,
      };

    case LOGOUT_ARTISAN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case LOGIN_ARTISAN_FAIL:
    case REGISTER_ARTISAN_FAIL:
      return {
        ...state,
        isAuthenticatedArtisan: false,
        loading: false,
        artisan: null,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export const artisanReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
    case UPDATE_ARTISAN_REQUEST:
    case DELETE_ARTISAN_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_PROFILE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
    case UPDATE_ARTISAN_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_ARTISAN_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_PROFILE_RESET:
    case UPDATE_PASSWORD_RESET:
    case UPDATE_ARTISAN_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case DELETE_ARTISAN_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case UPDATE_PROFILE_FAIL:
    case UPDATE_PASSWORD_FAIL:
    case UPDATE_ARTISAN_FAIL:
    case DELETE_ARTISAN_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_PASSWORD_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload,
      };
    case NEW_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
      };

    case NEW_PASSWORD_FAIL:
    case FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const artisansReducer = (state = { artisans: [] }, action) => {
  switch (action.type) {
    case ALL_ARTISANS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ALL_ARTISANS_SUCCESS:
      return {
        loading: false,
        artisans: action.payload.artisans,
        artisansCount: action.payload.artisansCount,
        resPerPage: action.payload.resPerPage,
        filteredArtisansCount: action.payload.filteredArtisansCount,
      };

    case ALL_ARTISANS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const artisanDetailsReducer = (state = { artisan: {} }, action) => {
  switch (action.type) {
    case ARTISAN_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ARTISAN_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        artisan: action.payload,
      };

    case ARTISAN_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};
