import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { forgotPassword, clearErrors } from '../../actions/userActions'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    
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

            <div className="center-screen tile">
                
                <div className="auth shadow-lg">
                    <form onSubmit={submitHandler}>
                        <h3 className="mb-3 text-start">Forgot Password</h3>
                        <div className="mb-3">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                            />
                        </div>
                        <div class="mb-3 text-end">
                            <Link to="/login" className="btn btn-link text-dark-1">Back to login</Link>
                            <button type="submit" disabled={loading} className={`btn bg-primary-1 px-3 ${loading? 'loading':''}`}>Send Email</button>
                        </div>

                    </form>
                </div>
            </div>
            
        </Fragment>
    )
}

export default ForgotPassword
