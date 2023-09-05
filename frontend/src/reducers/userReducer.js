import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_RESET,
  UPDATE_PROFILE_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_RESET,
  DELETE_USER_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_RESET,
  UPDATE_PASSWORD_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_RESET,
  UPDATE_USER_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  CLEAR_ERRORS,
  WALLET_BALANCE_REQUEST,
  WALLET_BALANCE_SUCCESS,
  WALLET_BALANCE_FAIL,
  WALLET_TOPUP_REQUEST,
  WALLET_TOPUP_SUCCESS,
  WALLET_TOPUP_FAIL,
  WALLET_TOPUP_LINK,
  WALLET_TOPUP_LINK_RESET,
  WALLET_TOPUP_VERIFY,
  WALLET_TOPUP_RESET,
  CHANGE_USER_MODE_REQUEST,
  CHANGE_USER_MODE_SUCCESS,
  CHANGE_USER_MODE_FAIL,
  WALLET_TRANSACTIONS_REQUEST,
  WALLET_TRANSACTIONS_SUCCESS,
  WALLET_TRANSACTIONS_FAIL,
  ACTIVATION_LINK_REQUEST,
  ACTIVATION_LINK_SUCCESS,
  ACTIVATION_LINK_FAIL,
  ACTIVATE_ACCOUNT_REQUEST,
  ACTIVATE_ACCOUNT_SUCCESS,
  ACTIVATE_ACCOUNT_FAIL,
  REGISTER_USER_RESET,
  REGISTER_AGENT_RESET,
  REGISTER_AGENT_SUCCESS,
  REGISTER_AGENT_REQUEST,
  REGISTER_AGENT_FAIL,
} from "../constants/userConstants";

export const authReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case REGISTER_USER_REQUEST:
    case REGISTER_AGENT_REQUEST:
    case LOGIN_REQUEST:
    case LOAD_USER_REQUEST:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
      };

    case CHANGE_USER_MODE_REQUEST:
      return{
        ...state,
        loading: true
      };

    case REGISTER_USER_SUCCESS:
    case REGISTER_AGENT_SUCCESS:
      return{
        ...state,
        loading: false,
        message: action.payload
      }

    case REGISTER_USER_RESET:
    case REGISTER_AGENT_RESET:
      return{
        ...state,
        message: null
      }
    case LOGIN_SUCCESS:
    case LOAD_USER_SUCCESS:
    case CHANGE_USER_MODE_SUCCESS:
      localStorage.setItem('userMode', action.payload.userMode)
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case LOGOUT_SUCCESS:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
      };
    case LOAD_USER_FAIL:
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case LOGOUT_FAIL:
    case CHANGE_USER_MODE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case LOGIN_FAIL:
    case REGISTER_USER_FAIL:
    case REGISTER_AGENT_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        user: null,
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

export const activateAccountReducer = (state = {}, action)=>{
  switch (action.type) {
    case ACTIVATE_ACCOUNT_REQUEST:
      return{
        loading: true,
        message: action.payload
      }
    case ACTIVATE_ACCOUNT_SUCCESS:
      return{
        ...state,
        loading: false,
        message: action.payload,
      }
    case ACTIVATE_ACCOUNT_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    default:
      return {...state}
  }
}

export const activationLinkReducer = (state = {}, action)=>{
  switch (action.type) {
    case ACTIVATION_LINK_REQUEST:
      return{
        loading: true
      }
    case ACTIVATION_LINK_SUCCESS:
      return{
        ...state,
        loading: false,
        message: action.payload,
      }
    case ACTIVATION_LINK_FAIL:
      return{
        loading: false,
        error: action.payload
      }
    default:
      return {...state}
  }
}
export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_REQUEST:
    case UPDATE_PASSWORD_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case UPDATE_PROFILE_SUCCESS:
    case UPDATE_PASSWORD_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };
      

    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_PROFILE_RESET:
    case UPDATE_PASSWORD_RESET:
    case UPDATE_USER_RESET:
      return {
        ...state,
        isUpdated: false,
      };

    case DELETE_USER_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case UPDATE_PROFILE_FAIL:
    case UPDATE_PASSWORD_FAIL:
    case UPDATE_USER_FAIL:
    case DELETE_USER_FAIL:
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

export const walletReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_BALANCE_REQUEST:
    case WALLET_TRANSACTIONS_REQUEST:
    case WALLET_TOPUP_REQUEST:
    case WALLET_TOPUP_VERIFY:
      return {
        ...state,
        loading: true
      }
    case WALLET_BALANCE_SUCCESS:
      return{
        ...state,
        loading: false,
        walletBalance: action.payload
      }
    case WALLET_TRANSACTIONS_SUCCESS:
      return{
        ...state,
        loading: false,
        transactions: action.payload
      }
    case WALLET_TOPUP_LINK:
      return{
        ...state,
        loading: false,
        link: action.payload
      }
    case WALLET_TOPUP_LINK_RESET:
      return{
        ...state,
        link: null
      }
    case WALLET_TOPUP_SUCCESS:
      return{
        ...state,
        loading: false,
        topup: action.payload
      }
    case WALLET_BALANCE_FAIL:
    case WALLET_TOPUP_FAIL:
    case WALLET_TRANSACTIONS_FAIL:
      return{
        ...state,
        loading: false,
        error: action.payload
      }
    case WALLET_TOPUP_RESET:
      return{
        ...state,
        topup: null
      }
    default:
      return state;
  }
}

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

export const allUsersReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case ALL_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ALL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
      };

    case ALL_USERS_FAIL:
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

export const userDetailsReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case USER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case USER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload,
      };

    case USER_DETAILS_FAIL:
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
