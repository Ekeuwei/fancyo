import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wallet: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    walletStart: state => {
      state.loading = true;
      state.error = null;
    },
    walletSuccess: (state, action) => {
      state.walletBalance = action.payload;
      state.loading = false;
    },
    walletFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    myTransactionsStart: state => {
      state.loading = true;
      state.error = null;
    },
    myTransactionsSuccess: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    myTransactionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    getBanksStart: state => {
      state.loading = true;
      state.error = null;
    },
    getBanksSuccess: (state, action) => {
      state.banks = action.payload;
      state.loading = false;
    },
    getBanksFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    verifyAccountNumberStart: state => {
      state.loading = true;
      state.error = null;
      state.bankAccountDetails = null;
    },
    verifyAccountNumberSuccess: (state, action) => {
      state.bankAccountDetails = action.payload;
      state.loading = false;
    },
    verifyAccountNumberFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    addAccountDetailsStart: state => {
      state.loading = true;
      state.error = null;
    },
    addAccountDetailsSuccess: (state, action) => {
      state.message = action.payload;
      state.loading = false;
    },
    addAccountDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    cashoutRequestStart: state => {
      state.loading = true;
      state.error = null;
    },
    cashoutRequestSuccess: (state, action) => {
      state.message = action.payload.message;
      state.walletBalance = action.payload.walletBalance;
      state.loading = false;
    },
    cashoutRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    
    fundWalletStart: state => {
      state.loading = true;
      state.error = null;
    },
    fundWalletSuccess: (state, action) => {
      state.paymentLink = action.payload;
      state.loading = false;
    },
    fundWalletFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getBadgeStart: state => {
      state.loading = true;
      state.error = null;
    },
    getBadgeSuccess: (state, action) => {
      state.badge = action.payload;
      state.loading = false;
    },
    getBadgeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    verifyTopupStart: state => {
      state.loading = true;
      state.error = null;
    },
    verifyTopupSuccess: (state, action) => {
      state.topup = action.payload.topup;
      state.walletBalance = action.payload.walletBalance;
      state.loading = false;
    },
    verifyTopupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    getUsersStart: state => {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    getUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    getWithdrawalsStart: state => {
      state.loading = true;
      state.error = null;
    },
    getWithdrawalsSuccess: (state, action) => {
      state.withdrawals = action.payload;
      state.loading = false;
    },
    getWithdrawalsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },



    fetchBvnDetailsStart: state => {
      state.loading = true;
      state.error = null;
    },
    fetchBvnDetailsSuccess: (state, action) => {
      state.bvnDetails = action.payload;
      state.loading = false;
    },
    fetchBvnDetailsFailure: (state, action) => {
      state.loading = false;
      state.bvnDetails = null;
      state.error = action.payload;
    },
    
    
    clearUserErrors: (state) => {
      state.error = null;
      state.message = null;
    },
    createUserError: (state, action) => {
      state.error = action.payload;
      state.message = null;
    },
    clearLink: (state) => {
      state.error = null;
      state.link = null;
    },
    createUserMessage: (state, action) => {
      state.error = null;
      state.message = action.payload;
    },



    // Similar actions for register, logout, etc.

    createToast:(state, action)=>{
      state.toast = action.payload
    },
    clearToast:(state)=>{
      state.toast = null
    }
  },
});

export const { 
  walletStart,
  walletSuccess,
  walletFailure,
  myTransactionsStart,
  myTransactionsSuccess,
  myTransactionsFailure,
  getBanksStart,
  getBanksSuccess,
  getBanksFailure,
  verifyAccountNumberStart,
  verifyAccountNumberSuccess,
  verifyAccountNumberFailure,
  addAccountDetailsStart,
  addAccountDetailsSuccess,
  addAccountDetailsFailure,
  cashoutRequestStart,
  cashoutRequestSuccess,
  cashoutRequestFailure,
  fundWalletStart,
  fundWalletSuccess,
  fundWalletFailure,
  verifyTopupStart,
  verifyTopupSuccess,
  verifyTopupFailure,
  fetchBvnDetailsStart,
  fetchBvnDetailsSuccess,
  fetchBvnDetailsFailure,
  getBadgeStart,
  getBadgeSuccess,
  getBadgeFailure,
  
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  getWithdrawalsStart,
  getWithdrawalsSuccess,
  getWithdrawalsFailure,

  clearLink,
  clearUserErrors,
  createUserError,
  createUserMessage,
  createToast,
  clearToast,
} = userSlice.actions;
export default userSlice.reducer;
