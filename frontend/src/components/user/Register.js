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
        password: '',
        avatar: ''
    })

    const avatarRef = useRef();

    const[shakeFields, setShakeFields] = useState([]);

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

        const emptyFields = Object.keys(user).filter(key => user[key] === "");
        setShakeFields(emptyFields);

        if(emptyFields.length === 0){
            dispatch(register(user))
        }

    }

    const onChange = e => {
        let value = e.target.value;
        if(e.target.name === 'avatar'){
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2){
                    setUser(prev => ({...prev, avatar:reader.result}))
                }
            }

            reader.readAsDataURL(e.target.files[0])
        }else{
            setUser(prev => ({ ...prev, [e.target.name]: value }))
        }

        setShakeFields([])
    }

    return (
        <Fragment>
            <MetaData title={'Register User'} />

            <section className='center-screen tile'>
                <div className="auth">
                    <form onSubmit={ submitHandler} encType='multipart/form-data'>
                        <h3 class="form-title"><strong>REGISTER</strong></h3>
                        
                        <div className="avatar-preview mb-3">
                            <div class={`avatar ${shakeFields.includes('avatar')?'shake':''}`}>
                                <img src={ user.avatar || '/images/default_avatar.png' } alt="Avatar Preview" />
                                <i className="fa fa-pencil-square-o edit-icon" onClick={() => avatarRef.current.click()} aria-hidden="true"></i>
                            </div>
                            {shakeFields.includes('avatar')&&<span className={'input-warning'}>Please upload a picture</span>}
                        </div>
                        <div class="d-none">
                            <input 
                                name="avatar"
                                type="file" 
                                class="d-none" 
                                id="avatar"
                                ref={avatarRef}
                                onChange={onChange}
                            />
                        </div>
                        <div className={`mb-3 ${shakeFields.includes('firstName')?'shake':''}`}>
                            <input 
                                type="name" 
                                name="firstName" 
                                class={`form-control `} 
                                id="firstName" 
                                placeholder="First Name"
                                value={user.firstName}
                                onChange={onChange}
                            />
                            {shakeFields.includes('firstName')&&<label className={'input-warning'}>First name required</label>}
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('lastName')?'shake':''}`} >
                            <input 
                                name="lastName"
                                type="name" 
                                class="form-control" 
                                id="lastName" 
                                placeholder="Last Name"
                                value={user.lastName}
                                onChange={onChange}
                            />
                            {shakeFields.includes('lastName') && <label for="lastName" class="input-warning">Last name required</label>}
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('gender')?'shake':''}`}>
                            <select 
                                class="form-select" 
                                aria-label="Select State" 
                                name="gender"
                                value={user.gender}
                                onChange={onChange} >
                                <option selected></option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {shakeFields.includes('gender') && <label for="gender" class="input-warning">Select your gender</label>}
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('phoneNumber')?'shake':''}`} >
                            <input 
                                name="phoneNumber"
                                type="phone" 
                                class="form-control"
                                id="phoneNumber"
                                placeholder='08030000000'
                                value={user.phoneNumber}
                                onChange={onChange}
                            />
                            {shakeFields.includes('phoneNumber') && <label for="phoneNumber" class="input-warning">Enter a valid phone number</label>}
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('email')?'shake':''}`} >
                            <input 
                                name="email"
                                type="email" 
                                class={`form-control ${shakeFields.includes('email')?'shake':''}`} 
                                id="email" 
                                placeholder="name@example.com"
                                value={user.email}
                                onChange={onChange}
                            />
                            {shakeFields.includes('email') && <label for="email" class="input-warning">Enter a valid email</label>}
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('password')?'shake':''}`} >
                            <input 
                                name='password'
                                type="password" 
                                class={`form-control ${shakeFields.includes('password')?'shake':''}`}
                                id="password"
                                placeholder='password'
                                value={user.password}
                                onChange={onChange}
                            />
                            {shakeFields.includes('password') && <label for="password" class="input-warning">Enter password</label>}
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
