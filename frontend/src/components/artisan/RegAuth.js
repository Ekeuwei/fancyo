import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { register, clearErrors, savePersonalInfo, saveContactInfo } from '../../actions/userActions'

const RegAuth = ({ history }) => {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const personalInfo = JSON.parse(localStorage.getItem('personalInfo'));
    const contactInfo = JSON.parse(localStorage.getItem('contactInfo'));

    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');


    const alert = useAlert();
    const dispatch = useDispatch()

    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
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
            formData.set('firstName', personalInfo.firstName)
            formData.set('lastName', personalInfo.lastName)
            formData.set('email', personalInfo.email)
            formData.set('phoneNumber', personalInfo.phoneNumber)
            formData.set('avatar', personalInfo.avatar)

            formData.set('address', contactInfo.address)
            formData.set('city', contactInfo.city)
            formData.set('state', contactInfo.state)
            formData.set('lga', contactInfo.lga)

            formData.set('username', userName)
            formData.set('password', password)
            formData.set('confirmPassword', confirmPassword)
        }
        else {
            history.push('/register')
        }
        

        dispatch(register(formData))
        // localStorage.clear()
    }

    return (
        <Fragment>
            <MetaData title={'Register User'} />

            <section className='center-screen tile'>
                <div className="auth">
                    <form onSubmit={ submitHandler} encType='multipart/form-data'>
                        <h3 class="mb-3 text-start">Register - Finishing</h3>
                        <div class="progress mb-3 rounded-pill">
                            <div class="progress-bar bg-primary-2 rounded-pill" role="progressbar" style={{width: "100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input 
                                type="name" 
                                class="form-control" 
                                id="username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input 
                                type="password" 
                                class="form-control" 
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
