import { GET_REVIEWS_FAIL, GET_REVIEWS_REQUEST, GET_REVIEWS_SUCCESS, REVIEW_FAIL, REVIEW_REQUEST, REVIEW_SUCCESS } from "../constants/taskConstants";
import { 
    CLEAR_ERRORS, 
    CREATE_WORKER_FAIL, 
    CREATE_WORKER_REQUEST, 
    CREATE_WORKER_RESET, 
    CREATE_WORKER_SUCCESS,
    ALL_WORKERS_REQUEST,
    ALL_WORKERS_SUCCESS,
    ALL_WORKERS_FAIL,
    WORKER_DETAILS_REQUEST,
    WORKER_DETAILS_SUCCESS,
    WORKER_DETAILS_FAIL,
    WORKERS_SETUP_REQUEST,
    WORKERS_SETUP_SUCCESS,
    WORKERS_SETUP_FAIL,
    LOAD_USER_WORKERS_REQUEST,
    LOAD_USER_WORKERS_SUCCESS,
    LOAD_USER_WORKERS_FAIL,
    WORKER_REVIEW_REQUEST,
    WORKER_REVIEW_SUCCESS,
    WORKER_REVIEW_FAIL,
    WORKER_REVIEW_RESET
} from "../constants/workerConstants";

export const workerReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_WORKER_REQUEST:
    case WORKER_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };
      
    case CREATE_WORKER_SUCCESS:
    case WORKER_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload
      };


    case CREATE_WORKER_FAIL:
    case WORKER_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    case CREATE_WORKER_RESET:
    case WORKER_REVIEW_RESET:
      return {
        ...state,
        success: false
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const workerSetupReducer = (state = {setup: {}}, action) =>{
  switch (action.type) {
    case WORKERS_SETUP_REQUEST:
      return{
        ...state
      }
    case WORKERS_SETUP_SUCCESS:
      return {
        setup: action.payload.setup
      }
    case WORKERS_SETUP_FAIL:
      return{
        ...state,
        error: action.payload
      }
  
    default:
      return state
  }
}

export const userWorkersReducer = (state = {workers: []}, action) =>{
  switch (action.type) {
    case LOAD_USER_WORKERS_REQUEST:
      return{
        ...state,
        loading: true
      }
    case LOAD_USER_WORKERS_SUCCESS:
      return {
        workers: action.payload,
        loading: false
      }
    case LOAD_USER_WORKERS_FAIL:
      return{
        ...state,
        error: action.payload,
        loading: false
      }
  
    default:
      return state
  }
}

export const workersReducer = (state = { workers: [] }, action) => {
  switch (action.type) {
    case ALL_WORKERS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ALL_WORKERS_SUCCESS:
      return {
        loading: false,
        workers: action.payload.workers,
        workersCount: action.payload.workersCount,
        resPerPage: action.payload.resPerPage,
        filteredWorkersCount: action.payload.filteredWorkersCount,
      };

    case ALL_WORKERS_FAIL:
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

export const workerDetailsReducer = (state = { worker: {} }, action) => {
  switch (action.type) {
    case WORKER_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case WORKER_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        worker: action.payload,
      };

    case WORKER_DETAILS_FAIL:
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

export const reviewReducer = (state = { }, action) =>{
  switch (action.type) {
    case REVIEW_REQUEST:
    case GET_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case REVIEW_SUCCESS:
      return {
        ...state,
        review: action.payload
      }
    case GET_REVIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: action.payload
      }
    case REVIEW_FAIL:
    case GET_REVIEWS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
  
    default:
      return {...state}
  }
}