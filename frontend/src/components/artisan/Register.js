import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { register, clearErrors, savePersonalInfo } from '../../actions/userActions'

const Register = ({ history }) => {

    const [user, setUser] = useState({
        fistName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    })

    const { firstName, lastName, email, phoneNumber } = user;

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

        // const formData = new FormData();
        // formData.set('firstName', firstName)
        // formData.set('lastName', lastName)
        // formData.set('email', email)
        // formData.set('phoneNumber', phoneNumber)
        // formData.set('avatar', avatar)

        // dispatch(register(formData))

        dispatch(savePersonalInfo({firstName, lastName, email, phoneNumber, avatar}))
        history.push('/register/contact')
    }

    const onChange = e => {
        if(e.target.name === 'avatar'){
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2){
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])
        } else {

            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    return (
        <Fragment>
            <MetaData title={'Register User'} />

            <section className='center-screen tile'>
                <div className="auth">
                    <form onSubmit={ submitHandler} encType='multipart/form-data'>
                        <h3 class="mb-3 text-start">Register - Personal Details</h3>
                        <div class="progress mb-3 rounded-pill">
                            <div class="progress-bar bg-primary-2 rounded-pill" role="progressbar" style={{width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="mb-3">
                            <input 
                                name="avatar"
                                type="file" 
                                class="form-control" 
                                id="avatar"
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="firstName" class="form-label">First Name</label>
                            <input 
                                type="name" 
                                name="firstName" 
                                class="form-control" 
                                id="firstName" 
                                placeholder="First Name"
                                value={firstName}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="lastName" class="form-label">Last Name</label>
                            <input 
                                name="lastName"
                                type="name" 
                                class="form-control" 
                                id="lastName" 
                                placeholder="Last Name"
                                value={lastName}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input 
                                name="email"
                                type="email" 
                                class="form-control" 
                                id="email" 
                                placeholder="name@example.com"
                                value={email}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="number" class="form-label">Phone Number</label>
                            <input 
                                name="phoneNumber"
                                type="number" 
                                class="form-control" 
                                id="number"
                                value={phoneNumber}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3 text-end">
                            <button type="button" class="btn btn-link text-dark-1" >Login</button>
                            <button type="submit" class="btn bg-primary-1 px-3">Next</button>
                        </div>
                    </form>
                </div>
            </section>

        </Fragment>
    )
}

export default Register
