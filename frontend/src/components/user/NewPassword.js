import React,{Fragment, useState, useEffect } from 'react'

import { useNavigate, useParams } from 'react-router-dom'
import MetaData from '../layout/MetaData'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { resetPassword, clearErrors } from '../../actions/userActions'

const NewPassword = () => {

    const [ password, setPassword ] = useState('');
    const [ confirmPassword, setConfirmPassword ] = useState('');
    
    const alert = useAlert()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const params = useParams()
    const { error, success } = useSelector(state=> state.forgotPassword );

    useEffect(() =>{

        if(error){
            alert.error(error);
            dispatch(clearErrors());        
        }

        if(success){
            alert.success('Password updated successfully');
            navigate('/login');
        }

    },[dispatch, alert, error, success, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);
        dispatch(resetPassword(params.token, formData))
    }
    return (
        <Fragment>
            <MetaData title={'New Password Reset'} />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={ submitHandler }>
                        <h1 className="mt-2 mb-5">New Password</h1>
                        <div className="form-group">
                            <label htmlFor="old_password_field">Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="new_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default NewPassword