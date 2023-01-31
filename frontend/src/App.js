import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails';
import PageNotFound from './components/error/PageNotFound';

// auth or user imports 
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import NewPassword from './components/user/NewPassword';

// admin imports 
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrdersList from './components/admin/OrdersList';
import ProcessOrder from './components/admin/ProcessOrder';
import UsersList from './components/admin/UsersList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';

// cart Imports
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';

// order Imports
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';

import ProtectedRoute from './components/route/ProtectedRoute';

import { loadUser } from './actions/userActions';
import { useSelector } from 'react-redux';
import store from './store';

import { BrowserRouter as Router,Routes, Route  } from'react-router-dom';
import axios from 'axios';


//payment
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState('')

  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
  
  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripApiKey() {

      const { data } = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/v1/stripeapi`);
      setStripeApiKey(data.stripeApiKey)
    }

    getStripApiKey();

  }, [])
  
  const {user,isAuthenticated, loading} = useSelector( state => state.auth)

  

  
  return (
    <Router>
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Routes> 
          <Route path="/" element={ <Home /> } />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/cart" element={ <Cart /> } />
          <Route path="/shipping" element={ <ProtectedRoute> <Shipping /> </ProtectedRoute> } />
          <Route path="/order/confirm" element={ <ProtectedRoute> <ConfirmOrder /> </ProtectedRoute> } />
          <Route path="/success" element={ <ProtectedRoute> <OrderSuccess /> </ProtectedRoute> } />
          <Route path="/orders/me" element={ <ProtectedRoute> <ListOrders /> </ProtectedRoute> } />
          <Route path="/orders/:id" element={ <ProtectedRoute> <OrderDetails /> </ProtectedRoute> } />
          
          { stripeApiKey && 
            <Route path="/payment" 
            element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Payment/>
            </Elements>
            } 
            />
          }

          <Route path="/login" element={ <Login /> } />
          <Route path="/register" element={ <Register /> } />
          <Route path="/password/forgot" element={ <ForgotPassword /> } />
          <Route path="/password/reset/:token" element={ <NewPassword /> } />
          <Route path="/me" element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          <Route path="/me/update" element={<ProtectedRoute> <UpdateProfile /> </ProtectedRoute>} />
          <Route path="/password/update" element={<ProtectedRoute> <UpdatePassword /> </ProtectedRoute>} />
          </Routes>  
      </div>
      <Routes>
        <Route path="/dashboard" element={ <ProtectedRoute isAdmin={ true }> <Dashboard /> </ProtectedRoute> } />
        <Route path="/admin/products" element={ <ProtectedRoute isAdmin={ true }> <ProductsList /> </ProtectedRoute> } />
        <Route path="/admin/product" element={ <ProtectedRoute isAdmin={ true }> <NewProduct /> </ProtectedRoute> } />
        <Route path="/admin/product/:id" element={ <ProtectedRoute isAdmin={ true }> <UpdateProduct /> </ProtectedRoute> } />
        <Route path="/admin/orders" element={ <ProtectedRoute isAdmin={ true }> <OrdersList /> </ProtectedRoute> } />
        <Route path="/admin/order/:id" element={ <ProtectedRoute isAdmin={ true }> <ProcessOrder /> </ProtectedRoute> } />
        <Route path="/admin/users" element={ <ProtectedRoute isAdmin={ true }> <UsersList /> </ProtectedRoute> } />
        <Route path="/admin/user/:id" element={ <ProtectedRoute isAdmin={ true }> <UpdateUser /> </ProtectedRoute> } />
        <Route path="/admin/reviews" element={ <ProtectedRoute isAdmin={ true }> <ProductReviews /> </ProtectedRoute> } />
        <Route path="*" element={ <PageNotFound /> } />
      </Routes>
        {!loading && (!isAuthenticated || user.role!=='admin') && (
          <Footer />
        )} 
      
    </div>
    </Router>
  );
}

export default App;
