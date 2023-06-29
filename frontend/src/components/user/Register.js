import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { register, clearErrors } from '../../actions/userActions'

const Register = ({ history }) => {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        password: ''
    })

    const avatarRef = useRef();

    const { firstName, lastName, gender, email, phoneNumber, password } = user;

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
            if(error !== 'Login first to access the resource')
                alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const data = {
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            gender,
            avatar,
        }

        dispatch(register(data))
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
                        
                        <div className="avatar-preview">
                            <div class="avatar">
                                <img src={ avatarPreview } alt="Avatar Preview" />
                                <i className="fa fa-pencil-square-o edit-icon" onClick={() => avatarRef.current.click()} aria-hidden="true"></i>
                            </div>
                        </div>
                        <h3 class="py-3 text-start">Register</h3>
                        <div class="progress mb-3 rounded-pill">
                            <div class="progress-bar bg-primary-2 rounded-pill" role="progressbar" style={{width: "100%"}} aria-valuenow="100" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="mb-3 d-none">
                            <input 
                                name="avatar"
                                type="file" 
                                class="form-control" 
                                id="avatar"
                                ref={avatarRef}
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
                            <label for="state" class="form-label">Gender</label>
                            <select 
                                class="form-select" 
                                aria-label="Select State" 
                                name="gender"
                                value={gender}
                                onChange={onChange} >
                                <option selected>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="number" class="form-label">Phone Number</label>
                            <input 
                                name="phoneNumber"
                                type="phone" 
                                class="form-control" 
                                id="number"
                                value={phoneNumber}
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
                            <label for="password" class="form-label">Password</label>
                            <input 
                                name='password'
                                type="password" 
                                class="form-control" 
                                id="password"
                                value={password}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3 text-end">
                            <Link to="/login" class="btn btn-link text-dark-1" >Login</Link>
                            <button disabled={loading} type="submit" class={`${loading? 'loading':''} btn bg-primary-1 px-3`}>Submit</button>
                        </div>
                    </form>
                </div>
            </section>

        </Fragment>
    )
}

export default Register
