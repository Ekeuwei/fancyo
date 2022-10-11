import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './components/layout/Header'
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';

import Login from './components/user/Login'
import Register from './components/user/Register'

import { loadUser } from './actions/userActions'
import { useSelector } from 'react-redux'
import store from './store'
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';

// Cart imports
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import axios from 'axios';

// Payments
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/orders/ListOrders';
import OrderDetails from './components/orders/OrderDetails';


// Admin Imports
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';
import Task from './components/user/Task';
import ContactInfo from './components/user/ContactInfo';
import RegAuth from './components/user/RegAuth';

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('');

  useEffect(()=>{
    store.dispatch(loadUser())

    async function getStripeApiKey(){
      const { data } = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey();

  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container_del container-fluid_del">
          <Route path = "/" component = {Home} exact />
          <Route path = "/search/:keyword" component = {Home} />
          <Route path = "/product/:id" component = {ProductDetails} exact />

          <Route path = "/cart" component = {Cart} />
          <ProtectedRoute path = "/shipping" component = {Shipping} />
          <ProtectedRoute path = "/order/confirm" component = {ConfirmOrder} />
          <ProtectedRoute path = "/success" component = {OrderSuccess} />
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path = "/payment" component = {Payment} />
            </Elements>
          }

          <Route path = "/login" component = {Login} />
          <Route path = "/register" component = {Register} exact />
          <Route path="/register/contact" component={ContactInfo} exact />
          <Route path="/register/password" component={RegAuth} exact />
          <Route path = "/password/forgot" component = {ForgotPassword} exact />
          <Route path = "/password/reset/:token" component = {NewPassword} exact />
          <Route path = "/user" component={Profile} exact />
          <Route path = "/user/task" component={Task} exact />
          {/* <ProtectedRoute path = "/me" component = {MyProfile} exact /> */}
          <ProtectedRoute path = "/me/update" component = {UpdateProfile} exact />
          <ProtectedRoute path = "/password/update" component = {UpdatePassword} exact />
          
          <ProtectedRoute path = "/orders/me" component = {ListOrders} exact />
          <ProtectedRoute path = "/order/:id" component = {OrderDetails} exact />

        </div>
        <ProtectedRoute path = "/dashboard" isAdmin={true} component = {Dashboard} exact />
        <ProtectedRoute path = "/admin/products" isAdmin={true} component = {ProductsList} exact />
        <ProtectedRoute path = "/admin/product" isAdmin={true} component = {NewProduct} exact />
        <ProtectedRoute path = "/admin/product/:id" isAdmin={true} component = {UpdateProduct} exact />
        
        <ProtectedRoute path = "/admin/orders/" isAdmin={true} component = {OrdersList} exact />
        <ProtectedRoute path = "/admin/order/:id" isAdmin={true} component = {ProcessOrder} exact />
        <ProtectedRoute path = "/admin/users/" isAdmin={true} component = {UsersList} exact />
        <ProtectedRoute path = "/admin/user/:id" isAdmin={true} component = {UpdateUser} exact />
        <ProtectedRoute path = "/admin/reviews" isAdmin={true} component = {ProductReviews} exact />
        
        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
      </div>
    </Router>
    
  );
}

export default App;
