import axios from "axios";

import {
  TASKS_DETAILS_REQUEST,
  TASKS_DETAILS_SUCCESS,
  TASKS_DETAILS_FAIL,
  ADMIN_TASKS_REQUEST,
  ADMIN_TASKS_SUCCESS,
  ADMIN_TASKS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_FAIL,
  NEW_TASK_REQUEST,
  NEW_TASK_SUCCESS,
  NEW_TASK_FAIL,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  MY_TASKS_REQUEST,
  MY_TASKS_SUCCESS,
  MY_TASKS_FAIL,
  UPDATE_TASK_PROGRESS_REQUEST,
  UPDATE_TASK_PROGRESS_SUCCESS,
  UPDATE_TASK_PROGRESS_FAIL,
  CREATE_TASK_FAIL,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  MY_WORKS_SUCCESS,
  NEARBY_TASK_REQUEST,
  NEARBY_TASK_SUCCESS,
  NEARBY_TASK_FAIL
} from "../constants/taskConstants";

// Get currently logged user tasks
export const myTasks = (keyword) => async (dispatch) => {
  keyword = keyword==='pending'? `${keyword}_request`:keyword
  try {
    dispatch({ type: MY_TASKS_REQUEST });

    const { data } = await axios.get(`/api/v1/tasks?keyword=${keyword}`);

    dispatch({
      type: MY_TASKS_SUCCESS,
      payload: data.tasks,
    });
  } catch (error) {
    dispatch({
      type: MY_TASKS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Get currently logged user tasks
export const myWorks = (keyword) => async (dispatch) => {
  keyword = keyword==='pending'? `${keyword}_request`:keyword
  try {
    dispatch({ type: MY_TASKS_REQUEST });

    const { data } = await axios.get(`/api/v1/works?keyword=${keyword}`);

    dispatch({
      type: MY_WORKS_SUCCESS,
      payload: data.works,
    });
  } catch (error) {
    dispatch({
      type: MY_TASKS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const newTask = (taskData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_TASK_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.post(`/api/v1/task/new`, taskData, config);

    dispatch({
      type: NEW_TASK_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_TASK_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Create task request 
export const createTaskRequst = (details) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    dispatch({type: CREATE_TASK_REQUEST})

    const { data } = await axios.post('/api/v1/task/request', details, config);

    dispatch({
      type: CREATE_TASK_SUCCESS,
      payload: data
    })
    
  } catch (error) {
    dispatch({
      type: CREATE_TASK_FAIL,
      payload: error.response.data.message
    });
  }
}

// Get nearby tasks requested by users => '/api/v1/tasks/nearby'
export const getNearbyTasks = (details) => async (dispatch)=>{
  const config = {
    headers:{
      'Content-Type':'application/json'
    }
  }
  try {
    dispatch({type: NEARBY_TASK_REQUEST});

    const { data } = await axios.post(`/api/v1/tasks/nearby`, details, config);
    
    dispatch({
      type: NEARBY_TASK_SUCCESS,
      payload: data.nearbyTasks
    })
  } catch (error) {
    dispatch({
      type: NEARBY_TASK_FAIL,
      payload: error.response.data.message
    })
  }
}

// Delete task (Admin)
export const deleteTask = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_TASK_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/task/${id}`);

    dispatch({
      type: DELETE_TASK_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_TASK_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const taskWorkerApplication = async (details)=>{
  const config = {
    headers: {
      'Content-Type':'application/json'
    }
  }
  try {

    const { data } = await axios.put('/api/v1/task/request/apply', details, config);

    return{
      success: data.success,
      error: null,
    }
  } catch (error) {
    return{
      error: error.response.data.message,
      success: null,
    }
  }
}

// Update Task Progress
export const updateTaskProgress = (message) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TASK_PROGRESS_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/v1/task/${message.taskId}`,
      message,
      config
    );

    dispatch({
      type: UPDATE_TASK_PROGRESS_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_PROGRESS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Update Task Progress
export const updateTaskProgressLocal = async (message) => {
  try {

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/v1/task/${message.taskId}`,
      message,
      config
    );

    return { success: data }
  } catch (error) {
    return { error: error.response.data.message }
  }
};

// Update Task Rates
export const updateTaskRate = async (id, amount, final) => {
  final = final || ''
  try {

    const { data } = await axios.put(`/api/v1/taskrate/?id=${id}&amount=${amount}&final=${final}`);

    return { success: data }
    
  } catch (error) {
    return { error: error.response.data.message }
  }
};

// Update Task (Admin)
export const updateTask = (id, taskData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_TASK_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const { data } = await axios.put(
      `/api/v1/admin/task/${id}`,
      taskData,
      config
    );

    dispatch({
      type: UPDATE_TASK_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_TASK_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getTaskDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: TASKS_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/task/${id}`);

    dispatch({
      type: TASKS_DETAILS_SUCCESS,
      payload: data.task,
    });
  } catch (error) {
    dispatch({
      type: TASKS_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_REVIEW_REQUEST });

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.put(`/api/v1/review/`, reviewData, config);

    dispatch({
      type: NEW_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: NEW_REVIEW_FAIL,
      payload: error.response.data.message,
    });
  }
};

export const getAdminTasks = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_TASKS_REQUEST });

    const { data } = await axios.get(`/api/v1/admin/tasks`);

    dispatch({
      type: ADMIN_TASKS_SUCCESS,
      payload: data.tasks,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_TASKS_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

// Get task revires
export const getTasksReviews = (id) => async (dispatch) => {
  try {
    dispatch({ type: GET_REVIEWS_REQUEST });

    const { data } = await axios.get(`/api/v1/reviews?id=${id}`);

    dispatch({
      type: GET_REVIEWS_SUCCESS,
      payload: data.reviews,
    });
  } catch (error) {
    dispatch({
      type: GET_REVIEWS_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

// Get task revires
export const deleteReview = (id, taskId) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_REVIEW_REQUEST });

    const { data } = await axios.delete(
      `/api/v1/reviews?id=${id}&taskId=${taskId}`
    );

    dispatch({
      type: DELETE_REVIEW_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.errMessage,
    });
  }
};

// Clear Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
