import {
  ALL_TASKS_REQUEST,
  ALL_TASKS_SUCCESS,
  ALL_TASKS_FAIL,
  TASKS_DETAILS_REQUEST,
  TASKS_DETAILS_SUCCESS,
  TASKS_DETAILS_FAIL,
  MY_TASKS_REQUEST,
  MY_TASKS_SUCCESS,
  MY_TASKS_FAIL,
  NEW_REVIEW_REQUEST,
  NEW_REVIEW_SUCCESS,
  NEW_REVIEW_RESET,
  NEW_REVIEW_FAIL,
  NEW_TASK_REQUEST,
  NEW_TASK_SUCCESS,
  NEW_TASK_RESET,
  NEW_TASK_FAIL,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_RESET,
  DELETE_TASK_FAIL,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_RESET,
  UPDATE_TASK_FAIL,
  GET_REVIEWS_REQUEST,
  GET_REVIEWS_SUCCESS,
  GET_REVIEWS_RESET,
  GET_REVIEWS_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_FAIL,
  ADMIN_TASKS_REQUEST,
  ADMIN_TASKS_SUCCESS,
  ADMIN_TASKS_FAIL,
  CLEAR_ERRORS,
  UPDATE_TASK_PROGRESS_REQUEST,
  UPDATE_TASK_PROGRESS_SUCCESS,
  UPDATE_TASK_PROGRESS_FAIL,
  UPDATE_TASK_PROGRESS_RESET,
} from "../constants/taskConstants";

export const tasksReducer = (state = { tasks: [] }, action) => {
  switch (action.type) {
    case ALL_TASKS_REQUEST:
    case ADMIN_TASKS_REQUEST:
      return {
        loading: true,
        tasks: [],
      };

    case ADMIN_TASKS_SUCCESS:
      return {
        loading: false,
        tasks: action.payload,
      };

    case ALL_TASKS_SUCCESS:
      return {
        loading: false,
        tasks: action.payload.tasks,
        tasksCount: action.payload.tasksCount,
        resPerPage: action.payload.resPerPage,
        filteredTasksCount: action.payload.filteredTasksCount,
      };

    case ALL_TASKS_FAIL:
    case ADMIN_TASKS_FAIL:
      return {
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

export const taskDetailsReducer = (state = { task: {} }, action) => {
  switch (action.type) {
    case TASKS_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case TASKS_DETAILS_SUCCESS:
      return {
        loading: false,
        task: action.payload,
      };

    case TASKS_DETAILS_FAIL:
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

export const taskRequestReducer = (state = { task: {} }, action) => {
  switch (action.type) {
    case NEW_TASK_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_TASK_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
      };

    case NEW_TASK_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_TASK_RESET:
      return {
        ...state,
        success: false,
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

export const singleTaskReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_TASK_REQUEST:
    case UPDATE_TASK_REQUEST:
    case UPDATE_TASK_PROGRESS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_TASK_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case UPDATE_TASK_SUCCESS:
    case UPDATE_TASK_PROGRESS_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      };

    case DELETE_TASK_FAIL:
    case UPDATE_TASK_FAIL:
    case UPDATE_TASK_PROGRESS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case DELETE_TASK_RESET:
      return {
        ...state,
        isDeleted: false,
      };

    case UPDATE_TASK_RESET:
    case UPDATE_TASK_PROGRESS_RESET:
      return {
        ...state,
        isUpdated: false,
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

export const myTaskReducer = (state = { tasks: [] }, action) => {
  switch (action.type) {
    case MY_TASKS_REQUEST:
      return {
        loading: true,
      };

    case MY_TASKS_SUCCESS:
      return {
        loading: false,
        tasks: action.payload,
      };

    case MY_TASKS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      };

    case DELETE_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_REVIEW_RESET:
      return {
        ...state,
        isDeleted: false,
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

export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case NEW_REVIEW_SUCCESS:
      return {
        loading: false,
        success: action.payload,
      };

    case NEW_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case NEW_REVIEW_RESET:
      return {
        ...state,
        success: false,
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

export const taskReviewReducer = (state = [], action) => {
  switch (action.type) {
    case GET_REVIEWS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case GET_REVIEWS_SUCCESS:
      return {
        loading: false,
        reviews: action.payload,
      };

    case GET_REVIEWS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case GET_REVIEWS_RESET:
      return {
        ...state,
        success: false,
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
