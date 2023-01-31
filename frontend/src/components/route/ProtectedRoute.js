import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
 
const ProtectedRoute = ({ isAdmin, children }) => {
    const {
        isAuthenticated = false,
        loading = true,
        user,
    } = useSelector((state) => state.auth);
 
    
    const navigate = useNavigate();
 
    if (loading) return <h1>loading...</h1>;
 
    if (!loading && isAuthenticated) {
        
        if (isAdmin === true && user.role !== "admin") {
            return navigate('/')
        }else{
            return children;
        }
        
    } else {
        return navigate('/login');
    }
};
 
export default ProtectedRoute;