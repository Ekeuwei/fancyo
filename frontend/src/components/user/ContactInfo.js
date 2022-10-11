import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { register, clearErrors, savePersonalInfo, saveContactInfo } from '../../actions/userActions'

const ContactInfo = ({ history }) => {

    const [user, setUser] = useState({
        address: '',
        city: '',
        state: '',
        lga: ''
    })

    const { address, city, state, lga } = user;

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

        dispatch(saveContactInfo({address, city, state, lga}))
        history.push('/register/password')
    }

    const onChange = e => {

        setUser({ ...user, [e.target.name]: e.target.value })
    }

    return (
        <Fragment>
            <MetaData title={'Register User'} />

            <section className='center-screen tile'>
                <div className="auth">
                    <form onSubmit={ submitHandler} encType='multipart/form-data'>
                        <h3 class="mb-3 text-start">Register - Contact Details</h3>
                        <div class="progress mb-3 rounded-pill">
                            <div class="progress-bar bg-primary-2 rounded-pill" role="progressbar" style={{width: "66%"}} aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <div class="mb-3">
                            <label for="contactAddress" class="form-label">Address</label>
                            <input 
                                type="address" 
                                class="form-control" 
                                id="contactAddress" 
                                placeholder="Contact Address"
                                name="address"
                                value={address}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="city" class="form-label">City</label>
                            <input 
                                type="name" 
                                class="form-control" 
                                id="city" 
                                placeholder="City"                                 
                                name="city"
                                value={city}
                                onChange={onChange}
                            />
                        </div>
                        <div class="mb-3">
                            <label for="state" class="form-label">State</label>
                            <select 
                                class="form-select" 
                                aria-label="Select State" 
                                name="state"
                                value={state}
                                onChange={onChange} >
                                <option selected>select</option>
                                <option value="Bayelsa">Bayelsa</option>
                                <option value="Rivers">Rivers</option>
                                <option value="Lagos">Lagos</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="lga" class="form-label">LGA</label>
                            <select 
                                class="form-select" 
                                aria-label="Select LGA"
                                name="lga"
                                value={lga}
                                onChange={onChange} >
                                <option selected>select</option>
                                <option value="Yenagoa">Yenagoa</option>
                                <option value="Southern Ijaw">Southern Ijaw</option>
                                <option value="Ekeremor">Ekeremor</option>
                            </select>
                        </div>
                        <div class="mb-3 text-end">
                            <button type="button" class="btn btn-link text-dark-1">Skip</button>
                            <button type="submit" class="btn bg-primary-1 px-3">Next</button>
                        </div>

                    </form>
                </div>
            </section>

        </Fragment>
    )
}

export default ContactInfo
