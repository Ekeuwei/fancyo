import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData';

import { login, clearErrors } from '../../actions/userActions'

const Login = ({ history, location }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const alert = useAlert();
    const dispatch = useDispatch()

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(()=>{

        if(isAuthenticated){
            history.push(redirect)
        }

        if(error){
            if(error !== 'Login first to access the resource')
                alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history, redirect])

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(login(email, password))
    }
    return (
        <Fragment>
            {/* {loading ? <Loader /> : ( */}
                <Fragment>
                    <MetaData title={'Login'} />

                    <section className="center-screen tile">
                        <div className="auth">
                            <form onSubmit={submitHandler}>
                                <h3 className="mb-3 text-start">Login</h3>
                                <div className="mb-3">
                                    <label for="email" className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e)=> setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label for="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password"
                                        value={password}
                                        onChange={(e)=> setPassword(e.target.value)}
                                    />
                                    <div className="text-end">
                                        <a href="/password/forgot" className="navbar-brand fs-6 text-dark-1 text-end">Forgot Password</a>
                                    </div>
                                </div>
                                <div className="mb-3 text-end">
                                    <Link to="/register" className="btn btn-link text-dark-1">Register</Link>
                                    <button type="submit" disabled={loading} className={`btn bg-primary-1 px-3 ${loading?'loading':''}`}>Login</button>
                                </div>
                            </form>
                        </div>
                    </section>
                </Fragment>
        </Fragment>
    )
}

export default Login
