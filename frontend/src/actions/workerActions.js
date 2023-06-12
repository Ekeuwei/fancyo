import axios from 'axios'
import { config } from 'dotenv'

import { 
    CLEAR_ERRORS,
    CREATE_WORKER_FAIL, 
    CREATE_WORKER_REQUEST, 
    CREATE_WORKER_SUCCESS,
    ALL_WORKERS_REQUEST,
    ALL_WORKERS_SUCCESS,
    ALL_WORKERS_FAIL,
    WORKER_DETAILS_REQUEST,
    WORKER_DETAILS_SUCCESS,
    WORKER_DETAILS_FAIL,
    WORKERS_SETUP_FAIL,
    WORKERS_SETUP_REQUEST,
    WORKERS_SETUP_SUCCESS,
    LOAD_USER_WORKERS_REQUEST,
    LOAD_USER_WORKERS_SUCCESS,
    LOAD_USER_WORKERS_FAIL,
    WORKER_REVIEW_REQUEST,
    WORKER_REVIEW_SUCCESS,
    WORKER_REVIEW_FAIL
} from '../constants/workerConstants';

// Create business request
export const createWorker = (workerData) => async (dispatch) => {
    try {
        dispatch({type: CREATE_WORKER_REQUEST})

        const { data } = await axios.post('/api/v1/create/worker', workerData, config);

        dispatch({
            type: CREATE_WORKER_SUCCESS,
            payload: data.success
        })
        
    } catch (error) {
        dispatch({
            type: CREATE_WORKER_FAIL,
            payload: error.response.data.message
        })
        
    }
}

//Get All Workers
export const getWorkers =
  (keyword = "", currentPage = 1, category, ratings = 0) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_WORKERS_REQUEST });

      let link = `/api/v1/workers?keyword=${keyword}&page=${currentPage}
                    &ratings[gte]=${ratings}`;

      if (category) {
        link = `/api/v1/workers?keyword=${keyword}&page=${currentPage}
                    &category=${category}&ratings[gte]=${ratings}`;
      }

      const { data } = await axios.get(link);

      dispatch({
        type: ALL_WORKERS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_WORKERS_FAIL,
        payload: error.response.data.message,
      });
    }
  };

export const workerReview = (ratings) => async (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json'}
  }
  try {
    dispatch({type: WORKER_REVIEW_REQUEST})

    const { data } = await axios.put(`/api/v1/create/worker/review`, ratings, config)

    dispatch({
      type: WORKER_REVIEW_SUCCESS,
      payload: data.success
    })
  } catch (error) {
    dispatch({
      type: WORKER_REVIEW_FAIL,
      payload: error.response.data.message
    })
  }
}

export const workerSetup = () => async (dispatch) =>{
  try {
    dispatch({type: WORKERS_SETUP_REQUEST});

    const { data } = await axios.get('/api/v1/workers/setup');

    dispatch({
      type: WORKERS_SETUP_SUCCESS,
      payload: data.setup
    })
    
  } catch (error) {
    dispatch({
      type: WORKERS_SETUP_FAIL,
      payload: error.response.data.message
    });
    
  }
}

// Get Logged in user workers => /api/v1/user/workers
export const loadUserWorkers = () => async (dispatch) =>{
    try {
        dispatch({ type: LOAD_USER_WORKERS_REQUEST})

        const { data } = await axios.get('/api/v1/user/workers')

        dispatch({
            type: LOAD_USER_WORKERS_SUCCESS,
            payload: data.workers
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_WORKERS_FAIL,
            payload: error.response.data.message
        })
    }
}

// Get Worker Details
export const getWorkerDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: WORKER_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/worker/${id}`);

    dispatch({
      type: WORKER_DETAILS_SUCCESS,
      payload: data.worker,
    });
  } catch (error) {
    dispatch({
      type: WORKER_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}