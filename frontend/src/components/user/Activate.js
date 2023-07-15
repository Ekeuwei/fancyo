import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import MetaData from '../layout/MetaData';

import { activateAccount } from '../../actions/userActions'
import SendActivationLink from './SendActivationLink';
import Loader from '../layout/Loader';

const Activate = ({ history, location }) => {

    // const alert = useAlert();
    const dispatch = useDispatch()

    const { loading, message, error } = useSelector(state => state.activateAccount);
    const [email, setEmail] = useState('')


    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if(token){
            dispatch(activateAccount(token));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const invalidLink = `The activation link you clicked on appears to be invalid. 
    It's possible that the link has expired or was entered incorrectly.`

    return (
        <Fragment>
            <Fragment>
                <MetaData title={'Login'} />
                <section className="center-screen tile">
                    {loading? <Loader />:
                    <div className={`auth`}>
                        <div className="text-center">
                            {error?<i className="fa fa-exclamation-circle fa-2x text-orange" aria-hidden="true"></i>:
                                <i className="fa fa-thumbs-up fa-2x text-success" aria-hidden="true"></i>}
                        </div>
                        <h2 className='text-center'>{error||message?.title}</h2>
                        <p>{error?invalidLink:message?.message}</p>
                            
                        <div className="mb-3 text-center">
                            {error?<SendActivationLink email={email} setEmail={setEmail}/>:
                                <Link to="/login" className="btn bg-primary-1 px-3 mx-3">Proceed to login</Link>}
                        </div>
                    </div>}
                </section>
            </Fragment>
        </Fragment>
    )
}

export default Activate
