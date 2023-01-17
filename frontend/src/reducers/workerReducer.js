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
    WORKER_DETAILS_FAIL
} from "../constants/workerConstants";

export const workerReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_WORKER_REQUEST:
      return {
        ...state,
        loading: true,
      };
      
    case CREATE_WORKER_SUCCESS:
      return {
        ...state,
        loading: false,
        workerCreated: action.payload
      };


    case CREATE_WORKER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    
    case CREATE_WORKER_RESET:
      return {
        ...state,
        workerCreated: false
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