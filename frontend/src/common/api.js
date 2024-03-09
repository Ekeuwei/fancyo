import axios from 'axios'
import { 
    loginFailure, 
    loginStart, 
    loginSuccess, 
    loadUserFailure, 
    loadUserStart, 
    loadUserSuccess,
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

    logout,
    clearAuthError,
} from "../app/auth/authSlice"

import {
    walletStart,
    walletSuccess,
    walletFailure,
    myTransactionsStart,
    myTransactionsSuccess,
    myTransactionsFailure,
    verifyAccountNumberStart,
    verifyAccountNumberSuccess,
    verifyAccountNumberFailure,
    getBanksStart,
    getBanksSuccess,
    getBanksFailure,
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
    createToast,
} from "../app/user/userSlice"

import {
    getProjectsStart,
    getProjectsSuccess,
    getProjectsFailure,
    getMyProjectsStart,
    getMyProjectsSuccess,
    getMyProjectsFailure,
    getProjectDetailsStart,
    getProjectDetailsSuccess,
    getProjectDetailsFailure,
    getPunterDetailsStart,
    getPunterDetailsSuccess,
    getPunterDetailsFailure,
    createProjectStart,
    createProjectSuccess,
    createProjectFailure,
    contributeStart,
    contributeSuccess,
    contributeFailure,
    loadTicketStart,
    loadTicketSuccess,
    loadTicketFailure,
    
} from "../app/project/projectSlice"

import {
    createTicketStart,
    createTicketSuccess,
    createTicketFailure,
    
} from "../app/ticket/ticketSlice"

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
})
// Login
export const api = {
    login: (loginDetails) => async (dispatch) =>{
        try {

            dispatch(loginStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post('/api/v1/login', loginDetails, config)

            localStorage.setItem('user', JSON.stringify(data.user))

            dispatch(loginSuccess(data.user))

        } catch (error) {
            dispatch(loginFailure(error.response.data.message))
        }
    },

    // Load User
    loadUser: () => async (dispatch) =>{
        try {
            dispatch(loadUserStart())

            const { data } = await instance.get('/api/v1/me')
            
            localStorage.setItem('user', JSON.stringify(data.user))

            dispatch(loadUserSuccess(data.user))

        } catch (error) {
            // purge user data from localStorage
            localStorage.removeItem('userMode')
            localStorage.removeItem('user')

            dispatch(loadUserFailure(error.response.data.message))
        }
    },

    // Logout user
    logout: () => async (dispatch) =>{
        try {
    
            await instance.get('/api/v1/logout')
    
            localStorage.removeItem('userMode')
            localStorage.removeItem('user')
            
            dispatch(logout())
    
        } catch (error) {
            dispatch(clearAuthError)
        }
    },


    // Validate User email or password during signup
    validateUser: (loginId) => async (dispatch) =>{
        try {
            dispatch(validateUserStart())

            const { data } = await instance.get(`/api/v1/auth/validateuser?loginId=${loginId}`)
            
            dispatch(validateUserSuccess(data))

        } catch (error) {

            dispatch(validateUserFailure(error.response.data.message))
        }
    },
    
    // Forogt password request
    forgotPassword: (loginId) => async (dispatch) =>{
        try {
            dispatch(forgotPasswordStart())

            const { data } = await instance.get(`/api/v1/password/forgot?loginId=${loginId}`)
            
            dispatch(forgotPasswordSuccess(data))

        } catch (error) {

            dispatch(forgotPasswordFailure(error.response.data.message))
        }
    },
    
    // Update password request
    updatePassword: (credentials) => async (dispatch) =>{
        try {
            dispatch(updatePasswordStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.put('/api/v1/password/update', credentials, config)
            data.message = 'Password updated successfully'

            
            dispatch(updatePasswordSuccess(data.message))

        } catch (error) {

            dispatch(updatePasswordFailure(error.response.data.message))
        }
    },
    
    // Reset password request
    resetPassword: (credentials) => async (dispatch) =>{
        try {
            dispatch(resetPasswordStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.put('/api/v1/password/reset', credentials, config)

            
            dispatch(resetPasswordSuccess(data.message))

        } catch (error) {

            dispatch(resetPasswordFailure(error.response.data.message))
        }
    },

    // Validate Token
    validateToken: (loginId, token) => async (dispatch) =>{
        try {
            dispatch(validateTokenStart())
            const config = {
                headers: {'content-Type': 'application/json'},
            }
            const { data } = await instance.post(`/api/v1/auth/validatetoken`, {loginId, token}, config)
            
            dispatch(validateTokenSuccess(data.isValidToken))

        } catch (error) {

            dispatch(validateTokenFailure(error.response.data.message))
        }
    },
    
    // Request Token
    requestToken: (loginId) => async (dispatch) =>{
        try {
            dispatch(requestTokenStart())

            const { data } = await instance.get(`/api/v1/auth/requesttoken?loginId=${loginId}`)
            
            dispatch(requestTokenSuccess(data))

        } catch (error) {

            dispatch(requestTokenFailure(error.response.data.message))
        }
    },
    
    // Register
    register: (userDetails) => async (dispatch) =>{
        try {
            dispatch(registerStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post('/api/v1/register', userDetails, config)

            localStorage.setItem('user', JSON.stringify(data.user))

            dispatch(registerSuccess(data.user))

        } catch (error) {

            dispatch(registerFailure(error.response.data.message))
        }
    },
    
    // Register
    updateProfile: (userDetails) => async (dispatch) =>{
        try {
            dispatch(updateProfileStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.put('/api/v1/me/update', userDetails, config)

            localStorage.setItem('user', JSON.stringify(data.user))

            dispatch(updateProfileSuccess(data.user))
            
            dispatch(createToast({message:'Update successful', type: 'success'}))

        } catch (error) {

            dispatch(updateProfileFailure(error.response.data.message))
        }
    },

    // Wallet 
    wallet: () => async (dispatch) =>{
        try {
            dispatch(walletStart())

            const { data } = await instance.get(`/api/v1/wallet`)
            
            dispatch(walletSuccess(data.balance))

        } catch (error) {

            dispatch(walletFailure(error.response.data.message))
        }
    },
    
    // myTransactions 
    myTransactions: () => async (dispatch) =>{
        try {
            dispatch(myTransactionsStart())

            const { data } = await instance.get(`/api/v1/transactions`)
            
            dispatch(myTransactionsSuccess(data.transactions))

        } catch (error) {

            dispatch(myTransactionsFailure(error.response.data.message))
        }
    },
    
    // AccountNumber 
    verifyAccountNumber: (credentials) => async (dispatch) =>{
        try {
            dispatch(verifyAccountNumberStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post(`/api/v1/verify/account`, {credentials}, config)
            
            dispatch(verifyAccountNumberSuccess(data.bankAccountDetails))

        } catch (error) {

            dispatch(verifyAccountNumberFailure(error.response.data.message))
        }
    },
    
    // Add Account Details 
    addAccountDetails: (accountDetails) => async (dispatch) =>{
        try {
            dispatch(addAccountDetailsStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.put(`/api/v1/add/account`, {accountDetails}, config)
            
            dispatch(addAccountDetailsSuccess(data.message))

            localStorage.setItem('user', JSON.stringify(data.user))
            dispatch(loginSuccess(data.user))

        } catch (error) {

            dispatch(addAccountDetailsFailure(error.response.data.message))
        }
    },
    
    // Fund Wallet
    fundWallet: (amount) => async (dispatch) =>{
        try {
            dispatch(fundWalletStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post(`/api/v1/flwpayment/process`, {amount}, config)

            dispatch(fundWalletSuccess(data.link))

        } catch (error) {

            dispatch(fundWalletFailure(error.response.data.message))
        }
    },

    // Fund Wallet
    verifyTopup: (query) => async (dispatch) =>{
        try {
            dispatch(verifyTopupStart())

            const { data } = await instance.get(`/api/v1/flwpayment/callback${query}`)
            
            dispatch(verifyTopupSuccess(data))

        } catch (error) {

            dispatch(verifyTopupFailure(error.response.data.message))
        }
    },
    
    // Fetch BVN Details
    fetchBvnDetails: (bvn) => async (dispatch) =>{
        try {
            dispatch(fetchBvnDetailsStart())

            const { data } = await instance.get(`/api/v1/bvn/validate?bvn=${bvn}`)
            
            dispatch(fetchBvnDetailsSuccess(data.bvnDetails))

        } catch (error) {

            dispatch(fetchBvnDetailsFailure(error.response.data.message))
        }
    },

    // Cashout request
    cashoutRequest: (details) => async (dispatch) =>{
        try {
            dispatch(cashoutRequestStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post(`/api/v1/fund/cashout`, {details}, config)
            
            dispatch(cashoutRequestSuccess(data))

        } catch (error) {

            dispatch(cashoutRequestFailure(error.response.data.message))
        }
    },

    // Get All Banks 
    getBanks: () => async (dispatch) =>{
        try {
            dispatch(getBanksStart())

            const { data } = await instance.get(`/api/v1/banks`)
            
            dispatch(getBanksSuccess(data.banks))

        } catch (error) {

            dispatch(getBanksFailure(error.response.data.message))
        }
    },


    // Get Projects 
    getProjects: () => async (dispatch) =>{
        try {
            dispatch(getProjectsStart())

            const { data } = await instance.get(`/api/v1/projects`)
            
            dispatch(getProjectsSuccess(data))

        } catch (error) {

            dispatch(getProjectsFailure(error.response.data.message))
        }
    },
    
    // Get My Projects 
    getMyProjects: () => async (dispatch) =>{
        try {
            dispatch(getMyProjectsStart())

            const { data } = await instance.get(`/api/v1/projects/me`)
            
            dispatch(getMyProjectsSuccess(data))

        } catch (error) {

            dispatch(getMyProjectsFailure(error.response.data.message))
        }
    },
    
    // Get Projects 
    getProjectDetails: (id) => async (dispatch) =>{
        try {
            dispatch(getProjectDetailsStart())

            const { data } = await instance.get(`/api/v1/project/${id}`)
            
            dispatch(getProjectDetailsSuccess(data))

        } catch (error) {

            dispatch(getProjectDetailsFailure(error.response.data.message))
        }
    },
    
    // Get Punter
    getPunterDetails: (id) => async (dispatch) =>{
        try {
            dispatch(getPunterDetailsStart())

            const { data } = await instance.get(`/api/v1/project/punter/${id}`)
            
            dispatch(getPunterDetailsSuccess(data))

        } catch (error) {

            dispatch(getPunterDetailsFailure(error.response.data.message))
        }
    },
    
    // Create project ticket 
    createProject: (details, projects) => async (dispatch) =>{
        try {
            dispatch(createProjectStart())

            // eslint-disable-next-line no-unused-vars
            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post(`/api/v1/project/new`, details, config)
            
            dispatch(createProjectSuccess(data.message))

            const newProjects = JSON.parse(JSON.stringify(projects))
            newProjects.projects.push(data.project)
            dispatch(getProjectsSuccess(newProjects))

        } catch (error) {

            dispatch(createProjectFailure(error.response.data.message))
        }
    },
    
    // Create project ticket 
    createTicket: (details, projectDetails) => async (dispatch) =>{
        try {
            dispatch(createTicketStart())

            // eslint-disable-next-line no-unused-vars
            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post(`/api/v1/ticket/new`, details, config)
            
            dispatch(createTicketSuccess(data.message))

            const newProjectDetails = JSON.parse(JSON.stringify(projectDetails))
            newProjectDetails.tickets.push(data.ticket)
            dispatch(getProjectDetailsSuccess(newProjectDetails))


        } catch (error) {

            dispatch(createTicketFailure(error.response.data.message))
        }
    },
    
    // Get ticket details from bookie 
    loadTicket: (details) => async (dispatch) =>{
        try {
            dispatch(loadTicketStart())

            // eslint-disable-next-line no-unused-vars
            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.get(`/api/v1/bookie/loadticket?id=${details.ticketId}&bookie=${details.bookie}`)
            
            dispatch(loadTicketSuccess(data))

        } catch (error) {

            dispatch(loadTicketFailure(error.response.data.message))
        }
    },
    
    // Contribute to project
    contribute: (details, projects, idx) => async (dispatch) =>{
        try {
            dispatch(contributeStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post(`/api/v1/project/contribute`, details, config)

            let projectsCopy = JSON.parse(JSON.stringify(projects))
            projectsCopy.projects[idx] = data.project
            
            dispatch(getProjectsSuccess(projectsCopy))

            dispatch(walletSuccess(data.walletBalance))
            
            dispatch(contributeSuccess(data.message))

        } catch (error) {

            dispatch(contributeFailure(error.response.data.message))
        }
    },
    
}