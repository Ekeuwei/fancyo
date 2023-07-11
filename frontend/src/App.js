import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";


import Login from "./components/user/Login";
import Register from "./components/user/Register";

import { loadUser } from "./actions/userActions";
import { useSelector } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";

// Cart imports
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";

// Payments
import OrderSuccess from "./components/cart/OrderSuccess";
import ListOrders from "./components/orders/ListOrders";
import OrderDetails from "./components/orders/OrderDetails";

// Admin Imports
import Dashboard from "./components/user/Dashboard";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import Task from "./components/user/Task";
import TaskProgress from "./components/user/TaskProgress";
import CreateWorker from "./components/worker/CreateWorker";
import WorkerDetails from "./components/worker/WorkerDetails";
import WorkerTask from "./components/user/task/WorkerTasks";
import Category from "./components/Category";
import AccountProfile from "./components/user/AccountProfile";
import AccountAddress from "./components/user/AccountAddress";
import AccountPassword from "./components/user/AccountPassword";
import AccountWorker from "./components/user/AccountWorker";
import AccounCreatetWorker from "./components/user/AccountCreateWorker";
import NearbyJobs from "./components/user/dashboardLayout/NearbyJobs";
import AllTasksAndWorks from "./components/user/dashboardLayout/AllTasksAndWorks";
import PaymentHistory from "./components/user/dashboardLayout/PaymentHistory";
import ManageJobs from "./components/user/dashboardLayout/ManageJobs";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container_del container-fluid_del">
          <Route path="/" component={Home} exact />
          <Route path="/category/:name" component={Category} exact />
          <Route path="/search/:keyword" component={Home} />
          <Route path="/product/:id" component={ProductDetails} exact />

          <Route path="/cart" component={Cart} />
          <ProtectedRoute path="/shipping" component={Shipping} />
          <ProtectedRoute path="/order/confirm" component={ConfirmOrder} />
          <ProtectedRoute path="/success" component={OrderSuccess} />
        

            {/* Worker */}
          <ProtectedRoute path="/user/create/worker" component={CreateWorker} exact />
          <Route path='/worker/:id' component={WorkerDetails} />

          {/* Task */}
          <Route path="/tasks" component={ManageJobs} exact />
          {/* <Route path="/tasks" component={Task} exact /> */}
          {/* <Route path="/works" component={WorkerTask} exact /> */}
          <Route path="/progress" component={TaskProgress} exact />

          {/* User */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} exact />
          <Route path="/password/forgot" component={ForgotPassword} exact />
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <Route path="/dashboard" component={Dashboard} exact/>
          {/* <ProtectedRoute path = "/me" component = {MyProfile} exact /> */}
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />

          {/* Account */}
          <Route path="/account/profile" component={AccountProfile} exact />
          <Route path="/account/contact" component={AccountAddress} exact />
          <Route path="/account/password" component={AccountPassword} exact />
          <Route path="/account/worker" component={AccountWorker} exact />
          <Route path="/account/worker/create" component={AccounCreatetWorker} exact />

          <ProtectedRoute path="/orders/me" component={ListOrders} exact />
          <ProtectedRoute path="/order/:id" component={OrderDetails} exact />
        </div>
        <ProtectedRoute path="/dashboards" isAdmin={true} component={Dashboard} exact />
        <ProtectedRoute path="/managetasks" component={AllTasksAndWorks} exact />
        <ProtectedRoute path="/morejobs" component={NearbyJobs} exact />
        <ProtectedRoute path="/payments" component={PaymentHistory} exact />
        
        <ProtectedRoute
          path="/admin/users/"
          isAdmin={true}
          component={UsersList}
          exact
        />
        <ProtectedRoute
          path="/admin/user/:id"
          isAdmin={true}
          component={UpdateUser}
          exact
        />
        <ProtectedRoute
          path="/admin/reviews"
          isAdmin={true}
          component={ProductReviews}
          exact
        />

        {!loading && (!isAuthenticated || user.role !== "admin") && <Footer />}
      </div>
    </Router>
  );
}

export default App;
