import React, { Fragment, useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { forgotPassword, clearErrors } from '../../actions/userActions'

const ForgotPassword = ({email, setEmail, setShowResetPassword}) => {
    
    const alert = useAlert();
    const dispatch = useDispatch()

    const { error, message, loading } = useSelector(state => state.forgotPassword)

    useEffect(() => {        

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(message){
            alert.success(message)
        }

    }, [dispatch, alert, error, message])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', email)

        dispatch(forgotPassword(formData))
    }

    return (
        <Fragment>
            <MetaData title={'Forgot Pasword'} />

            <div className="auth shadow-lg">
                <form onSubmit={submitHandler}>
                    <h3 className="mb-3 text-start">Forgot Password</h3>
                    <div className="mb-3">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="input"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>
                    <div class="mb-3 text-end">
                        <button type='button' onClick={()=>setShowResetPassword(false)} className="btn btn-link text-dark-1">Back to login</button>
                        <button type="submit" disabled={loading} className={`btn bg-primary-1 px-3 ${loading? 'loading':''}`}>Send Email</button>
                    </div>

                </form>
            </div>
            
        </Fragment>
    )
}

export default ForgotPassword
