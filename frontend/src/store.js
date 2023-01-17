import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import {
  productsReducer,
  productDetailsReducer,
  newReviewReducer,
  newProductReducer,
  productReducer,
  productReviewReducer,
  reviewReducer,
} from "./reducers/productReducers";
import {
  allUsersReducer,
  authReducer,
  forgotPasswordReducer,
  userDetailsReducer,
  userReducer,
} from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducers";
import {
  allOrdersReducer,
  myOrderReducer,
  newOrderReducer,
  orderDetailsReducer,
  orderReducer,
} from "./reducers/orderReducers";
import {
  artisansReducer,
  artisanReducer,
  artisanDetailsReducer,
  authArtisanReducer,
} from "./reducers/artisanReducers";
import {
  myTaskReducer,
  singleTaskReducer,
  taskRequestReducer,
  tasksReducer,
} from "./reducers/taskReducers";
import { workerDetailsReducer, workerReducer, workersReducer } from "./reducers/workerReducer";

const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  worker: workerReducer,
  workers: workersReducer,
  workerDetails: workerDetailsReducer,
  auth: authReducer,
  user: userReducer,
  authArtisan: authArtisanReducer,
  artisan: artisanReducer,
  artisans: artisansReducer,
  artisanDetails: artisanDetailsReducer,
  tasks: tasksReducer,
  singleTask: singleTaskReducer,
  myTasks: myTaskReducer,
  taskRequest: taskRequestReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,
  forgotPassword: forgotPasswordReducer,
  cart: cartReducer,
  newOrder: newOrderReducer,
  myOrders: myOrderReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,
  review: reviewReducer,
  newReview: newReviewReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productReviews: productReviewReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },
};

const middleware = [thunk];
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
