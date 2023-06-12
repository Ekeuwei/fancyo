import axios from "axios"
import { 
    PREFS_LGAS_FAIL, 
    PREFS_LGAS_REQUEST, 
    PREFS_LGAS_SUCCESS, 
    PREFS_STATES_FAIL, 
    PREFS_STATES_REQUEST,
    PREFS_STATES_SUCCESS, 
    PREFS_TOWNS_FAIL, 
    PREFS_TOWNS_REQUEST,
    PREFS_TOWNS_SUCCESS,
    WORKERS_CATEGORIES_FAIL,
    WORKERS_CATEGORIES_REQUEST,
    WORKERS_CATEGORIES_SUCCESS
} from "../constants/prefsConstants";

export const getStates = () => async (dispatch)=>{
    try {
        dispatch({type: PREFS_STATES_REQUEST})

        const { data } = await axios.get('/api/v1/prefs/states');
        
        dispatch({
            type: PREFS_STATES_SUCCESS,
            payload: data.states
        })
    } catch (error) {
        dispatch({
            type: PREFS_STATES_FAIL,
            payload: error.response.data.message
        })
    }
}

export const getLgas = (state)=> async (dispatch)=>{
    try {
        dispatch({type: PREFS_LGAS_REQUEST})

        const { data } = await axios.get(`/api/v1/prefs/lgas/${state}`);
        
        dispatch({
            type: PREFS_LGAS_SUCCESS,
            payload: data.lgas,
        })
    } catch (error) {
        dispatch({
            type: PREFS_LGAS_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getTowns = (lga)=> async (dispatch)=>{
    try {
        dispatch({type: PREFS_TOWNS_REQUEST})

        const { data } = await axios.get(`/api/v1/prefs/towns/${lga}`);
        
        dispatch({
            type: PREFS_TOWNS_SUCCESS,
            payload: data.towns,
        })
    } catch (error) {
        dispatch({
            type: PREFS_TOWNS_FAIL,
            payload: error.response.data.message,
        })
    }
}

export const getCategories = ()=> async (dispatch)=>{
    try {
        dispatch({type: WORKERS_CATEGORIES_REQUEST})

        const { data } = await axios.get(`/api/v1/prefs/categories`);
        
        dispatch({
            type: WORKERS_CATEGORIES_SUCCESS,
            payload: data.categories,
        })
    } catch (error) {
        dispatch({
            type: WORKERS_CATEGORIES_FAIL,
            payload: error.response.data.message,
        })
    }
}