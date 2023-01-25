import React, { Fragment } from 'react'
import Search from './Search'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logout } from '../../actions/userActions'

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();
    const {user, loading } = useSelector( state => state.auth );
    const { cartItems } = useSelector( state =>state.cart );

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Logged out successfully')
        
    }
    return (
    <Fragment>
        <nav className="navbar row">
            <div className="col-12 col-md-3">
                <div className="navbar-brand">
                    <Link to="/">
                    <img src="/images/logo.png" alt="ShopIT logo"/>
                    </Link>
                </div>
            </div>

            <div className="col-12 col-md-6 mt-2 mt-md-0">
            
                <Search />       
            
            </div>

            <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                { cartItems.length ?
                (<Link to="/cart" className = 'mr-3' style={{ textDecoration: 'none' }} >
                    <span id="cart" className="ml-3">Cart</span>
                    <span className="ml-1" id="cart_count">{ cartItems.length }</span>
                </Link>) : ''}
                { user ? (
                    <div className='dropdown d-inline mr-3'>
                        <Link to="#!" className="btn dropdown-toggle text-white mr-1" type="button" id="dropDownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <figure className="avatar avatar-nav">
                                <img 
                                    src={ user.avatar && user.avatar.url } 
                                    alt={ user && user.name } 
                                    className="rounded-circle mr-2"
                                />
                                <span className="avatar-title">{ user && user.name }</span>
                            </figure>
                        </Link>
                        <div className="dropdown-menu" aria-labelledby='dropDownMenuButton'>
                            {user && user.role === 'admin' && (
                                <Link className="dropdown-item" to="/dashboard">
                                    Dashboard
                                </Link> 
                            )}
                            <Link className="dropdown-item" to="/orders/me">
                                Orders
                            </Link>
                            <Link className="dropdown-item" to="/me">
                                Profile
                            </Link>
                            <Link className='dropdown-item text-danger' to="/" onClick={logoutHandler}>
                                Logout
                            </Link>
                        </div>
                    </div>
                ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">
                        Login
                    </Link> 
                }               
            </div>
        </nav>
    </Fragment>
  )
}

export default Header