import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Load user
    loadUserStart: state => {
      state.loading = true;
      state.error = null;
    },
    loadUserSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loadUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Update profile
    updateProfileStart: state => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Validate user
    validateUserStart: state => {
      state.loading = true;
      state.error = null;
    },
    validateUserSuccess: (state, action) => {
      state.message = action.payload.message;
      state.tokenExpires = action.payload.tokenExpires;
      state.loading = false;
    },
    validateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Validate user
    validateTokenStart: state => {
      state.loading = true;
      state.error = null;
      state.isValidToken = false;
    },
    validateTokenSuccess: (state, action) => {
      state.isValidToken = action.payload;
      state.loading = false;
      state.message = null;
    },
    validateTokenFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Request Token
    requestTokenStart: state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    requestTokenSuccess: (state, action) => {
      state.message = action.payload.message;
      state.tokenExpires = action.payload.tokenExpires;
      state.loading = false;
    },
    requestTokenFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Register user
    registerStart: state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Update Password user
    updatePasswordStart: state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updatePasswordSuccess: (state, action) => {
      state.message = action.payload;
      state.loading = false;
    },
    updatePasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Forgot Password user
    forgotPasswordStart: state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    forgotPasswordSuccess: (state, action) => {
      state.message = action.payload.message;
      state.tokenExpires = action.payload.tokenExpires;
      state.loading = false;
    },
    forgotPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // Forgot Password user
    resetPasswordStart: state => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    resetPasswordSuccess: (state, action) => {
      state.message = action.payload;
      state.passwordReset = true;
      state.loading = false;
    },
    resetPasswordFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    
    clearAuthError: (state) => {
        state.loading = false;
        state.error = null;
        state.message = null;
        state.passwordReset=null;
        state.tokenExpires=null;
        state.isValidToken = null;
    },
    
    createAuthError: (state, action) => {
        state.error = action.payload;
    },
    
    // Logout 
    logout: (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
    }
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  loadUserStart, 
  loadUserSuccess, 
  loadUserFailure,
  updateProfileStart, 
  updateProfileSuccess, 
  updateProfileFailure,
  validateUserStart, 
  validateUserSuccess, 
  validateUserFailure,
  validateTokenStart, 
  validateTokenSuccess, 
  validateTokenFailure,
  requestTokenStart, 
  requestTokenSuccess, 
  requestTokenFailure,
  registerStart, 
  registerSuccess, 
  registerFailure,
  updatePasswordStart, 
  updatePasswordSuccess, 
  updatePasswordFailure,
  forgotPasswordStart, 
  forgotPasswordSuccess, 
  forgotPasswordFailure,
  resetPasswordStart, 
  resetPasswordSuccess, 
  resetPasswordFailure,
  
  clearAuthError,
  createAuthError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
