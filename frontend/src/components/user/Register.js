import React, { Fragment, useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { register, clearErrors } from '../../actions/userActions'
import { REGISTER_USER_RESET } from '../../constants/userConstants';

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

    const inputRefs = {
        firstName: useRef(),
        lastName: useRef(),
        email: useRef(),
        phoneNumber: useRef(),
        gender: useRef(),
        password: useRef(),
        avatar: useRef()
    }

    const avatarRef = useRef();

    const[shakeFields, setShakeFields] = useState([]);

    const alert = useAlert();
    const dispatch = useDispatch()

    const { isAuthenticated, message, error, loading } = useSelector(state => state.auth);

    const [successMessage, setSuccessMesage] = useState("");

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
        }

        if(message){
            setSuccessMesage(message);
            dispatch({type: REGISTER_USER_RESET})
        }

        if (error) {
            if(error !== 'Login first to access the resource')
                alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, message, error, history])

    const [referralId, setReferralId] = useState(Cookies.get('referralId'))
    useEffect(()=>{
        // => register?ref=ABC123
        const urlParams = new URLSearchParams(window.location.search);
        // let referralId = Cookies.get('referralId');
        const newReferralId = urlParams.get('ref');

        if (!referralId || new Date(referralId) < new Date()) {
            // No existing referral code cookie or existing cookie has expired
            Cookies.set('referralId', newReferralId, { expires: 7 }); // Expires in 7 days
            setReferralId(newReferralId);
        }
    }, [referralId])

    const submitHandler = (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(user).filter(key => user[key] === "");
        setShakeFields(emptyFields);

        if(emptyFields.length === 0){
            dispatch(register({...user, referralId}))
        }else{
            inputRefs[emptyFields[0]].current.focus()
        }

    }

    const onChange = e => {
        let value = e.target.value.trim();
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
                    {successMessage?<div>
                        <div className="text-center">
                            <i className="fa fa-thumbs-up fa-2x text-success" aria-hidden="true"></i>
                        </div>
                        <h4 className='text-center success'>Registration successfull</h4>
                        <p>{successMessage}</p>
                        <div className="mt-3 text-center">
                            <Link to="/login" className="btn bg-primary-1 px-3 mx-3">Back to login</Link>
                        </div>                    
                    </div>:
                    <form onSubmit={ submitHandler} encType='multipart/form-data'>
                        <h3 className="form-title"><strong>REGISTER</strong></h3>
                        
                        <div className="avatar-preview mb-3" ref={inputRefs.avatar} tabIndex={0}>
                            <div className={`avatar ${shakeFields.includes('avatar')?'shake error':''}`}>
                                <img src={ user.avatar || '/images/default_avatar.png' } alt="Avatar Preview" />
                                <i className="fa fa-pencil-square-o edit-icon" onClick={() => avatarRef.current.click()} aria-hidden="true"></i>
                            </div>
                            {shakeFields.includes('avatar')&&<span className={'input-warning'}>Please upload a picture</span>}
                        </div>
                        <div className="d-none">
                            <input 
                                name="avatar"
                                type="file" 
                                className="d-none" 
                                id="avatar"
                                ref={avatarRef}
                                onChange={onChange}
                            />
                        </div>
                        <div className={`mb-3 `}>
                            <input 
                                type="name" 
                                name="firstName" 
                                className={`input ${shakeFields.includes('firstName')?'shake error':''}`} 
                                id="firstName" 
                                ref={inputRefs.firstName}
                                placeholder="First Name"
                                value={user.firstName}
                                onChange={onChange}
                            />
                            {/* {shakeFields.includes('firstName')&&<label className={'input-warning'}>First name required</label>} */}
                        </div>
                        <div className={`mb-3 `} >
                            <input 
                                name="lastName"
                                type="name" 
                                className={`input ${shakeFields.includes('lastName')?'shake error':''}`}
                                id="lastName" 
                                ref={inputRefs.lastName}
                                placeholder="Last Name"
                                value={user.lastName}
                                onChange={onChange}
                            />
                            {/* {shakeFields.includes('lastName') && <label for="lastName" className="input-warning">Last name required</label>} */}
                        </div>
                        <div className={`mb-3 `}>
                            <select 
                                className={`form-select input ${shakeFields.includes('gender')?'shake error':''}`} 
                                aria-label="Select State" 
                                name="gender"
                                ref={inputRefs.gender}
                                value={user.gender}
                                onChange={onChange} >
                                <option selected value="">Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                            {/* {shakeFields.includes('gender') && <label for="gender" className="input-warning">Select your gender</label>} */}
                        </div>
                        <div className={`mb-3`} >
                            <input 
                                name="phoneNumber"
                                type="phone" 
                                className={`input ${shakeFields.includes('phoneNumber')?'shake error':''}`}
                                id="phoneNumber"
                                ref={inputRefs.phoneNumber}
                                placeholder='Phone number'
                                value={user.phoneNumber}
                                onChange={onChange}
                            />
                            {/* {shakeFields.includes('phoneNumber') && <label for="phoneNumber" className="input-warning">Enter a valid phone number</label>} */}
                        </div>
                        <div className={`mb-3 `} >
                            <input 
                                name="email"
                                type="email" 
                                className={`input ${shakeFields.includes('email')?'shake error':''}`} 
                                id="email" 
                                ref={inputRefs.email}
                                placeholder="name@example.com"
                                value={user.email}
                                onChange={onChange}
                            />
                            {/* {shakeFields.includes('email') && <label for="email" className="input-warning">Enter a valid email</label>} */}
                        </div>
                        <div className={`mb-3`} >
                            <input 
                                name='password'
                                type="password" 
                                className={`input ${shakeFields.includes('password')?'shake error':''}`}
                                id="password"
                                ref={inputRefs.password}
                                placeholder='password'
                                value={user.password}
                                onChange={onChange}
                            />
                            {/* {shakeFields.includes('password') && <label for="password" className="input-warning">Enter password</label>} */}
                        </div>
                        <div className="mb-3 text-end">
                            <Link to="/login" className="btn btn-link text-dark-1" >Login</Link>
                            <button disabled={loading} type="submit" className={`${loading? 'loading':''} btn bg-primary-1 px-3`}>Submit</button>
                        </div>
                    </form>}
                </div>
            </section>

        </Fragment>
    )
}

export default Register
