import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData';

import { login, clearErrors } from '../../actions/userActions'
import SendActivationLink from './SendActivationLink';
import ForgotPassword from './ForgotPassword';

const Login = ({ history, location }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showRequestLinkForm, setRequestLinkForm] = useState(false)
    const [showResetPassword, setShowResetPassword] = useState(false)

    const alert = useAlert();
    const dispatch = useDispatch()

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const [inactiveError, setInactiveError] = useState(false);
    const redirect = location.search ? location.search.split('=')[1] : '/';

    const resendLink = async ()=> {
        setRequestLinkForm(true);
        setInactiveError(false);
        dispatch(clearErrors());
    }

    useEffect(()=>{

        if(isAuthenticated){
            history.push(redirect)
        }
        

        if(error){

            if(error !== 'Login first to access the resource')
                alert.error(error);
            
            setInactiveError(error.includes('activate your account'))

        }


    }, [dispatch, alert, isAuthenticated, error, history, redirect])

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(clearErrors());
        dispatch(login(email, password))
    }
    return (
        <Fragment>
            <Fragment>
                <MetaData title={'Login'} />
                <section className="center-screen tile">
                    {!showResetPassword?
                    <div className="auth">
                        {showRequestLinkForm? 
                        <>
                            <h3 className="mb-3 text-start">Resend activation link</h3>
                            <SendActivationLink email={email} setEmail={setEmail} setRequestLinkForm={setRequestLinkForm}/>
                        </>:
                        <form onSubmit={submitHandler}>
                            <h3 className="mb-3 text-start">Login</h3>
                            {inactiveError&&<div className={`status-message`}>
                                <span className={`${error?'error':'success'}`}>{error} </span>
                                <span className='action' onClick={resendLink}>resend activation link</span>
                            </div>}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <div className="input">
                                    <input 
                                        type="email" 
                                        id="email" 
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e)=> setEmail(e.target.value.trim())}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input 
                                    type="password" 
                                    className="input" 
                                    id="password"
                                    value={password}
                                    onChange={(e)=> setPassword(e.target.value)}
                                />
                                <div className="text-end">
                                    <button type='button' onClick={()=>setShowResetPassword(true)} className="btn btn-link text-dark-1">Forgot password</button>
                                </div>
                            </div>
                            <div className="mb-3 text-end">
                                <Link to="/register" className="btn btn-link text-dark-1">Register</Link>
                                <button type="submit" disabled={loading} className={`btn bg-primary-1 px-3 ${loading?'loading':''}`}>Login</button>
                            </div>
                        </form>}
                    </div>:
                    <ForgotPassword email={email} setEmail={setEmail} setShowResetPassword={setShowResetPassword}/>}
                </section>
            </Fragment>
        </Fragment>
    )
}

export default Login
