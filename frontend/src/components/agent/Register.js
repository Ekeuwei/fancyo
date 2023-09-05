import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { clearErrors, registerAgent } from '../../actions/userActions'
import { REGISTER_AGENT_RESET } from '../../constants/userConstants';
import SearchDropdown from '../layout/SearchDropdown';
import { getLgas, getStates, getTowns } from '../../actions/prefsAction';
import { createRef } from 'react';

const Register = ({ history }) => {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        gender: '',
        password: '',
        avatar: '',
        state: {name: ''},
        lga: {name: ''},
        town: {name: ''},
        address:''
    })

    const inputRefs = {
        firstName: useRef(),
        lastName: useRef(),
        email: useRef(),
        phoneNumber: useRef(),
        gender: useRef(),
        password: useRef(),
        avatar: useRef(),
        state: useRef(),
        lga: useRef(),
        town: useRef(),
        address: useRef(),
    }

    const { states, lgas, towns } = useSelector(state => state.prefs);

    const avatarRef = useRef();

    const[shakeFields, setShakeFields] = useState([]);

    const alert = useAlert();
    const dispatch = useDispatch()

    const { isAuthenticated, message, error, loading } = useSelector(state => state.auth);

    const [successMessage, setSuccessMesage] = useState("");

    useEffect(()=>{
        dispatch(getStates())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        if(user.state._id){
            dispatch(getLgas(user.state._id))
        }
    }, [dispatch, user.state._id])

    useEffect(()=>{
        if(user.lga._id){
            dispatch(getTowns(user.lga._id))
        }
    }, [dispatch, user.lga._id])

    useEffect(() => {

        if (isAuthenticated) {
            history.push('/')
        }

        if(message){
            setSuccessMesage(message);
            dispatch({type: REGISTER_AGENT_RESET})
        }

        if (error) {
            if(error !== 'Login first to access the resource')
                alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, message, error, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const emptyFields = Object.keys(user).filter(key => user[key] === ""||user[key].name === "");
        setShakeFields(emptyFields);

        let contact;

        if(emptyFields.length === 0){
            
            contact = {
                address: user.address,
                town: user.town.name,
                lga: user.lga._id,
                state: user.state._id,
            }

            dispatch(registerAgent({...user, contact}))
        }else{
            inputRefs[emptyFields[0]].current.focus()
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

    const onChangeContactValue = (value, field) => {
        setUser(prev => ({...prev, [field]: value}))
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
                        <h3 class="form-title"><strong>AGENT REGISTERATION</strong></h3>
                        
                        <div className="avatar-preview mb-3" ref={inputRefs.avatar} tabIndex={0}>
                            <div class={`avatar ${shakeFields.includes('avatar')?'shake':''}`}>
                                <img src={ user.avatar || '/images/default_avatar.png' } alt="Avatar Preview" />
                                <i className="fa fa-pencil-square-o edit-icon" onClick={() => avatarRef.current.click()} aria-hidden="true"></i>
                            </div>
                            {shakeFields.includes('avatar')&& <span className={'input-warning'}>Please upload a picture</span>}
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
                                class={`input ${shakeFields.includes('firstName')?'error':''}`} 
                                id="firstName" 
                                ref={inputRefs.firstName}
                                placeholder="First Name"
                                value={user.firstName}
                                onChange={onChange}
                            />
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('lastName')?'shake':''}`} >
                            <input 
                                name="lastName"
                                type="name" 
                                class={`input ${shakeFields.includes('lastName')?'error':''}`}
                                id="lastName" 
                                ref={inputRefs.lastName}
                                placeholder="Last Name"
                                value={user.lastName}
                                onChange={onChange}
                            />
                        </div>
                        <div class={`mb-3`}>
                            <select 
                                class={`form-select input ${shakeFields.includes('gender')?'shake error':''}`} 
                                aria-label="Select State" 
                                name="gender"
                                ref={inputRefs.gender}
                                value={user.gender}
                                onChange={onChange} >
                                <option selected value={''}>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('phoneNumber')?'shake':''}`} >
                            <input 
                                name="phoneNumber"
                                type="phone" 
                                class={`input ${shakeFields.includes('phoneNumber')?'error':''}`}
                                id="phoneNumber"
                                ref={inputRefs.phoneNumber}
                                placeholder='08030000000'
                                value={user.phoneNumber}
                                onChange={onChange}
                            />
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('email')?'shake':''}`} >
                            <input 
                                name="email"
                                type="email" 
                                class={`input ${shakeFields.includes('email')?'error':''}`} 
                                id="email" 
                                ref={inputRefs.email}
                                placeholder="name@example.com"
                                value={user.email}
                                onChange={onChange}
                            />
                        </div>
                        <div class={`mb-3 ${shakeFields.includes('password')?'shake':''}`} >
                            <input 
                                name='password'
                                type="password" 
                                class={`input ${shakeFields.includes('password')?'error':''}`}
                                id="password"
                                ref={inputRefs.password}
                                placeholder='password'
                                value={user.password}
                                onChange={onChange}
                            />
                        </div>

                        {/* Contact Info */}
                        <div ref={inputRefs.state} tabIndex={0} className={`input mb-3 ${shakeFields.includes('state') ?'shake error':''}`}>
                            <SearchDropdown 
                                validateField={true} 
                                value={user.state} 
                                name={'state'} 
                                itemSelected = { onChangeContactValue }
                                onChange={onChangeContactValue} 
                                suggestions={states} 
                                placeholder='State' />
                        </div>
                        <div ref={inputRefs.lga} tabIndex={0} className={`input mb-3 ${shakeFields.includes('lga')?'shake error':''}`}>
                            <SearchDropdown 
                                validateField={true} 
                                value={user.lga} 
                                name={'lga'} 
                                itemSelected = { onChangeContactValue }
                                onChange={onChangeContactValue} 
                                suggestions={lgas} 
                                placeholder='Lga' />
                        </div>
                        <div ref={inputRefs.town} tabIndex={0} className={`input mb-3 ${shakeFields.includes('town')?'shake error':''}`}>
                            <SearchDropdown 
                                value={user.town} 
                                name={'town'}
                                itemSelected = { onChangeContactValue }
                                onChange={onChangeContactValue} 
                                suggestions={towns} 
                                placeholder='Name of Town' />
                        </div>
                        
                        <div className={`mb-3`}>
                            <textarea 
                                name="address" 
                                className={`input ${shakeFields.includes('address')?'shake error':''}`}
                                id="address"
                                ref={inputRefs.address}
                                value={user.address}
                                placeholder='Closest landmark'
                                onChange={onChange}
                            />
                        </div>

                        <div class="mb-3 text-end">
                            <Link to="/login" class="btn btn-link text-dark-1" >Login</Link>
                            <button disabled={loading} type="submit" class={`${loading? 'loading':''} btn bg-primary-1 px-3`}>Submit</button>
                        </div>
                    </form>}
                </div>
            </section>

        </Fragment>
    )
}

export default Register
