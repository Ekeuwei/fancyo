import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  wallet: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        getProjectsStart: state => {
            state.loading = true;
            state.error = null;
        },
        getProjectsSuccess: (state, action) => {
            state.projects = action.payload;
            state.loading = false;
        },
        getProjectsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        getMyProjectsStart: state => {
            state.loading = true;
            state.error = null;
        },
        getMyProjectsSuccess: (state, action) => {
            state.myProjects = action.payload;
            state.loading = false;
        },
        getMyProjectsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        // Create New Project 
        createProjectStart: state => {
            state.loading = true;
            state.error = null;
        },
        createProjectSuccess: (state, action) => {
            state.message = action.payload;
            state.loading = false;
        },
        createProjectFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        // Project Details
        getPunterDetailsStart: state => {
            state.loading = true;
            state.error = null;
        },
        getPunterDetailsSuccess: (state, action) => {
            state.punterDetails = action.payload;
            state.loading = false;
        },
        getPunterDetailsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        // Project Details
        getProjectDetailsStart: state => {
            state.loading = true;
            state.error = null;
        },
        getProjectDetailsSuccess: (state, action) => {
            state.projectDetails = action.payload;
            state.loading = false;
        },
        getProjectDetailsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        // Load Ticket Details
        loadTicketStart: state => {
            state.loading = true;
            state.error = null;
            state.ticket = null;
        },
        loadTicketSuccess: (state, action) => {
            state.ticket = action.payload;
            state.loading = false;
        },
        loadTicketFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        contributeStart: state => {
            state.loading = true;
            state.error = null;
        },
        contributeSuccess: (state, action) => {
            state.message = action.payload;
            state.loading = false;
        },
        contributeFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        
        clearProjectErrors: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
        clearLoadedTicket:(state)=>{
            state.ticket = null;
        }
    }
})


export const {
    getProjectsStart,
    getProjectsSuccess,
    getProjectsFailure,
    getMyProjectsStart,
    getMyProjectsSuccess,
    getMyProjectsFailure,
    getProjectDetailsStart,
    getProjectDetailsSuccess,
    getProjectDetailsFailure,
    contributeStart,
    contributeSuccess,
    contributeFailure,
    loadTicketStart,
    loadTicketSuccess,
    loadTicketFailure,
    createProjectStart,
    createProjectSuccess,
    createProjectFailure,
    getPunterDetailsStart,
    getPunterDetailsSuccess,
    getPunterDetailsFailure,
    
    clearLoadedTicket,
    clearProjectErrors
} = projectSlice.actions;

export default projectSlice.reducer;