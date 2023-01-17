import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { register, clearErrors } from '../../actions/artisanAction'

const RegAuth = ({ history }) => {

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const personalInfo = JSON.parse(localStorage.getItem('personalInfo'));
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo'));

    const alert = useAlert();
    const dispatch = useDispatch()

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
            localStorage.clear()
        }

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        if(personalInfo && contactInfo){

            formData.set('firstName', personalInfo.firstName)
            formData.set('lastName', personalInfo.lastName)
            formData.set('gender', personalInfo.gender)
            formData.set('email', personalInfo.email)
            formData.set('phoneNumber', personalInfo.phoneNumber)
            formData.set('contact', JSON.stringify(contactInfo))
            formData.set('password', password)
            formData.set('avatar', personalInfo.avatar)
        
        }
        else {
            history.push('/register/artisan')
        }
        
        dispatch(register(formData))
    }

    return (
        <Fragment>
            <MetaData title={'Register User'} />

            <section className='center-screen tile'>
                <div className="auth">
                    <form onSubmit={ submitHandler} encType='multipart/form-data'>
                        <div class="position-relative">
                            <div class="avatar-preview">
                            <img 
                                class="rounded-circle w-100 mx-auto" 
                                src={ personalInfo.avatar } alt="Avatar Preview"
                            />
                            </div>
                        </div>
                        <h3 class="py-3 text-start">Register - Finishing</h3>
                        <div class="progress mb-3 rounded-pill">
                            <div class="progress-bar bg-primary-2 rounded-pill" role="progressbar" style={{width: "100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div> 
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                required
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirm Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
                                required
                                id="confirmPassword" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <div class="mb-3 text-end">
                            <button type="submit" class="btn bg-primary-1 px-3">Submit</button>
                        </div>

                    </form>
                </div>
            </section>

        </Fragment>
    )
}

export default RegAuth
