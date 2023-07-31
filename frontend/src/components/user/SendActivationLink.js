import React, { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'

import { clearErrors, activationLink } from '../../actions/userActions'
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const SendActivationLink = ({email, setEmail, setRequestLinkForm}) => {
    
    const alert = useAlert();
    const dispatch = useDispatch()

    const { error, message, loading } = useSelector(state => state.activationLink)

    useEffect(() => {        

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(message){
            alert.success(message)
        }

    }, [dispatch, alert, error, message])

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(activationLink(email))
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="mb-3 input">
                <input
                    type="email"
                    id="email_field"
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value.trim())}
                />
                <span className={`${loading?'loading':''}`}>
                    {message?<i class="fa fa-check-circle-o success" aria-hidden="true"></i>:
                    <i class="fa fa-exclamation-circle text-orange" aria-hidden="true"></i>}
                </span>
            </div>
            <div class="mb-2 text-center">
                <button type="submit" disabled={loading} className={`btn bg-primary-1 px-3`}>Resend Activation Link</button>
                {setRequestLinkForm!==undefined?<button onClick={()=>setRequestLinkForm(false)} className="btn btn-link text-dark-1 px-3 mx-3">Back</button>:
                <Link to="/login" className="btn btn-link text-dark-1 px-3 mx-3">Back</Link>}
            </div>

        </form>
    )
}

export default SendActivationLink
