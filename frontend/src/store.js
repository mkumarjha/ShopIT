import { configureStore } from '@reduxjs/toolkit';
import { productReducers, productDetailReducer, newProductReducer, newReviewReducer, productReducer, productReviewsReducer, reviewReducer  } from './reducers/productReducers'
import { authReducer, userReducer, forgotPasswordReducer, allUserReducer, userDetailsReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducers/orderReducers';

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') 
          ? JSON.parse(localStorage.getItem('cartItems'))
          : [],
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    }
};

export default configureStore({
  reducer: {
    products: productReducers,
    productDetails: productDetailReducer,
    newProduct: newProductReducer,
    auth: authReducer,
    user: userReducer,
    allUsers: allUserReducer, 
    userDetails: userDetailsReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    product: productReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer
  },
  preloadedState: initialState
});

