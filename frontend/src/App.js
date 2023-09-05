import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";


import Login from "./components/user/Login";
import Register from "./components/user/Register";
import RegisterAgent from "./components/agent/Register";

import { loadUser } from "./actions/userActions";
import { useSelector } from "react-redux";
import store from "./store";
import ProtectedRoute from "./components/route/ProtectedRoute";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import NewPassword from "./components/user/NewPassword";

// Payments
import OrderSuccess from "./components/cart/OrderSuccess";
import ListOrders from "./components/orders/ListOrders";
import OrderDetails from "./components/orders/OrderDetails";

// Admin Imports
import Dashboard from "./components/user/Dashboard";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import TaskProgress from "./components/user/TaskProgress";
import CreateWorker from "./components/worker/CreateWorker";
import WorkerDetails from "./components/worker/WorkerDetails";
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
import Activate from "./components/user/Activate";
import ContactUs from "./components/ContactUs";

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
         
          <Route path="/contact" component={ContactUs} />
          <Route path="/about" component={ContactUs} />

          <ProtectedRoute path="/success" component={OrderSuccess} />
        

            {/* Worker */}
          <ProtectedRoute path="/user/create/worker" component={CreateWorker} exact />
          <Route path='/worker/:id' component={WorkerDetails} />

          {/* Task */}
          <ProtectedRoute path="/tasks" component={ManageJobs} exact />
          {/* <Route path="/tasks" component={Task} exact /> */}
          {/* <Route path="/works" component={WorkerTask} exact /> */}
          <ProtectedRoute path="/progress" component={TaskProgress} exact />

          {/* Agents */}
          <Route path="/agent/register" component={RegisterAgent} exact />

          {/* User */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} exact />
          <Route path="/activate" component={Activate} exact />
          {/* <Route path="/password/forgot" component={ForgotPassword} exact /> */}
          <Route path="/password/reset/:token" component={NewPassword} exact />
          <ProtectedRoute path="/dashboard" component={Dashboard} exact/>
          {/* <ProtectedRoute path = "/me" component = {MyProfile} exact /> */}
          <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
          <ProtectedRoute
            path="/password/update"
            component={UpdatePassword}
            exact
          />

          {/* Account */}
          <ProtectedRoute path="/account/profile" component={AccountProfile} exact />
          <ProtectedRoute path="/account/contact" component={AccountAddress} exact />
          <ProtectedRoute path="/account/password" component={AccountPassword} exact />
          <ProtectedRoute path="/account/worker" component={AccountWorker} exact />
          <ProtectedRoute path="/account/worker/create" component={AccounCreatetWorker} exact />

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
