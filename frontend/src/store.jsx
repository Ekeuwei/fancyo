import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './app/auth/dataSlice'
import authReducer from './app/auth/authSlice'
import userReducer from './app/user/userSlice'
import projectReducer from './app/project/projectSlice'
import ticketReducer from './app/ticket/ticketSlice'


export const store = configureStore({
  reducer: {
    data: dataReducer,
    auth: authReducer,
    user: userReducer,
    project: projectReducer,
    ticket: ticketReducer,
  },
});