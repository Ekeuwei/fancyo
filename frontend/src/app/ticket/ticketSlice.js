import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ticket: null,
  loading: false,
  error: null,
};

const ticketSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        
        // Create Project Ticket
        createTicketStart: state => {
            state.loading = true;
            state.error = null;
        },
        createTicketSuccess: (state, action) => {
            state.message = action.payload;
            state.loading = false;
        },
        createTicketFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        
        createTicketError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearTicketErrors: (state) => {
            state.loading = false;
            state.error = null;
            state.message = null;
        },
    }
})


export const {
    createTicketStart,
    createTicketSuccess,
    createTicketFailure,

    createTicketError,
    clearTicketErrors,
} = ticketSlice.actions;

export default ticketSlice.reducer;