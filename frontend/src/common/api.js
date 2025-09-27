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
    registerPunterStart,
    registerPunterSuccess,
    registerPunterFailure,
    updatePasswordStart,
    updatePasswordSuccess,
    updatePasswordFailure,
    forgotPasswordStart,
    forgotPasswordSuccess,
    forgotPasswordFailure,
    resetPasswordStart,
    resetPasswordSuccess,
    resetPasswordFailure,

    logoutStart,
    logoutSuccess,
    logoutFailure,
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
    getBadgeSuccess,
    fetchBvnDetailsStart,
    fetchBvnDetailsSuccess,
    fetchBvnDetailsFailure,
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    getWithdrawalsStart,
    getWithdrawalsSuccess,
    getWithdrawalsFailure,
    createToast,
    loadBetTicketStart,
    loadBetTicketSuccess,
    loadBetTicketFailure,
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
    getAllTicketsStart,
    getAllTicketsSuccess,
    getAllTicketsFailure,
    
} from "../app/ticket/ticketSlice"

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 10 * 1000,
    signal: AbortSignal.timeout(10 * 1000),
    timeoutErrorMessage: 'Request timeout, check network connectivity.'
})

// instance.interceptors.response.use(
//     response => response,
//     error => {
//         if(!error.response){
//             console.error('Network error: ', error.message)
//         }

//         return Promise.reject(error)
//     }
// )

// Login
export const api = {
    login: (loginDetails) => async (dispatch) =>{
        try {

            dispatch(loginStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            // console.log('Login request started')
            
            const { data } = await instance.post('/api/v1/login', loginDetails, config)
            
            // console.log('Login response received')
            
            localStorage.setItem('user', JSON.stringify(data.user))

            if(data.badge){
                dispatch(getBadgeSuccess(data.badge))
            }

            dispatch(loginSuccess(data.user))

        } catch (error) {
            console.log('Error encountered ++', error.response.data.message)
            dispatch(loginFailure(error.response.data.message))
        }
    },

    // Load User
    loadUser: () => async (dispatch) =>{
        try {
            dispatch(loadUserStart())

            const { data } = await instance.get('/api/v1/me')
            
            localStorage.setItem('user', JSON.stringify(data.user))

            if(data.badge){
                dispatch(getBadgeSuccess(data.badge))
            }

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
            const config = {
                        headers: {'content-Type': 'application/json'},
                    }
            dispatch(logoutStart())

            const response = await instance.post('/api/v1/logout', {}, config)
    
            dispatch(logoutSuccess())

            console.log(response);
            
            // document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem('userMode')
            localStorage.removeItem('user')
            
    
        } catch (error) {
            dispatch(logoutFailure(error.response.data.message))
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
    
    // Register Punter
    registerPunter: (userDetails) => async (dispatch) =>{
        try {
            dispatch(registerPunterStart())

            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.post('/api/v1/register/punter', userDetails, config)

            localStorage.setItem('user', JSON.stringify(data.user))

            dispatch(registerPunterSuccess(data.user))

        } catch (error) {

            dispatch(registerPunterFailure(error.response.data.message))
        }
    },
    
    // Update profile
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
    
    // Fetch BVN Details
    loadBetTicket: (freeTicket, vipTicket) => async (dispatch) =>{
        try {
            dispatch(loadBetTicketStart())

            const { data } = await instance.get(`/api/v1/betticket?freeTicket=${freeTicket}&vipTicket=${vipTicket}`)
            
            dispatch(loadBetTicketSuccess(data.betTicket))

        } catch (error) {

            dispatch(loadBetTicketFailure(error.response.data.message))
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


    // Admin requests
    // Get All tickets 
    getUsers: () => async (dispatch) =>{
        try {
            dispatch(getUsersStart())

            // eslint-disable-next-line no-unused-vars
            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.get(`/api/v1/admin/users?status=pending`)
            
            dispatch(getUsersSuccess(data.users))

        } catch (error) {

            dispatch(getUsersFailure(error.response.data.message))
        }
    },
    // Get All tickets 
    getAllTickets: () => async (dispatch) =>{
        try {
            dispatch(getAllTicketsStart())

            // eslint-disable-next-line no-unused-vars
            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.get(`/api/v1/admin/tickets?status=pending`)
            
            dispatch(getAllTicketsSuccess(data.tickets))

        } catch (error) {

            dispatch(getAllTicketsFailure(error.response.data.message))
        }
    },
    // Get All withdrawal requests 
    getWithdrawals: () => async (dispatch) =>{
        try {
            dispatch(getWithdrawalsStart())

            // eslint-disable-next-line no-unused-vars
            const config = {
                headers: {'content-Type': 'application/json'},
            }

            const { data } = await instance.get(`/api/v1/admin/withdrawals?status=pending`)
            
            dispatch(getWithdrawalsSuccess(data.withdrawals))

        } catch (error) {

            dispatch(getWithdrawalsFailure(error.response.data.message))
        }
    },
    
}