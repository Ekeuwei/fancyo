import { PREFS_LGAS_FAIL, PREFS_LGAS_REQUEST, PREFS_LGAS_SUCCESS, PREFS_STATES_FAIL, PREFS_STATES_REQUEST, PREFS_STATES_SUCCESS, PREFS_TOWNS_FAIL, PREFS_TOWNS_REQUEST, PREFS_TOWNS_SUCCESS, WORKERS_CATEGORIES_FAIL, WORKERS_CATEGORIES_REQUEST, WORKERS_CATEGORIES_SUCCESS } from "../constants/prefsConstants";

export const preferences = (state={states:[], lgas:[], towns:[], categories:[]}, action) => {
    switch (action.type) {
        case PREFS_STATES_REQUEST:
        case PREFS_LGAS_REQUEST:
        case PREFS_TOWNS_REQUEST:
        case WORKERS_CATEGORIES_REQUEST:
            return {
                ...state,
                loading: true
            }
        case PREFS_STATES_SUCCESS:
            return {
                ...state,
                states: action.payload,
                loading: false
            }
        case PREFS_LGAS_SUCCESS:
            return {
                ...state,
                lgas: action.payload,
                loading: false
            }
        case PREFS_TOWNS_SUCCESS:
            return {
                ...state,
                towns: action.payload,
                loading: false
            }
        case WORKERS_CATEGORIES_SUCCESS:
            return {
                ...state,
                categories: action.payload,
                loading: false
            }
        case PREFS_STATES_FAIL:
        case PREFS_LGAS_FAIL:
        case PREFS_TOWNS_FAIL:
        case WORKERS_CATEGORIES_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
    
        default:
            return{
                ...state
            }
    }
}