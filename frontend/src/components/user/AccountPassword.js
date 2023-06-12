import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { clearErrors, updatePassword } from '../../actions/userActions';
import { Tabs } from './AccountProfile';
import { useAlert } from 'react-alert';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';


const AccountPassword = () => {
    const alert = useAlert();
    const history = useHistory();
    const dispatch = useDispatch();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmed, setConfirmed] = useState(false);

    useEffect(()=>{
        setConfirmed(newPassword === confirmPassword && newPassword.length > 5)
    },[confirmPassword, newPassword]);

    const { error, loading, isUpdated } = useSelector(state => state.user);

    useEffect(()=>{
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isUpdated){
            alert.success('Password updated successfully')

            dispatch({
                type: UPDATE_PASSWORD_RESET
            })

            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }

    }, [dispatch, alert, isUpdated, error])

    const submitHandler = (e)=>{
        e.preventDefault();

        if(confirmed){
            const formData = new FormData();
            formData.set('oldPassword', oldPassword);
            formData.set('password', newPassword);
    
            dispatch(updatePassword(formData));
        }
        else{
            // document
        }
    }
            
  return (
    <Fragment>
        <div className="account-breadcrumbs">
            <img className="rounded-circle me-2" src="/images/avatar.png" style={{height: "3em"}} alt="" />
            <div className="breadcrumbs-title">
                <span><strong>Alfred Ekeuwei</strong> / <strong>Edit Profile</strong></span>
                <p className='mb-0'>Setup your presence and hiring needs</p>
            </div>
        </div>
        <Tabs history={history}/>
        <form className='mx-3' onSubmit={submitHandler}>
            <div className="mb-3">
                <label for="oldPassword" className="form-label">Current Password</label>
                <input 
                    type="password" 
                    name="oldPassword" 
                    className="form-control" 
                    id="oldPassword" 
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label for="newPassword" className="form-label">New Password</label>
                <input 
                    name="newPassword"
                    type="password" 
                    className="form-control" 
                    id="newPassword" 
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                />
                {newPassword.length<6 && <label className="form-label text-secondary">Password must be 6 charaters long</label>}
            </div>
            <div className="mb-3">
                <label for="confirmPassword" className="form-label">
                    Confirm Password
                    {confirmed&& <i className="fa fa-check-circle ms-1 text-success" aria-hidden="true"></i>}
                </label>
                <input 
                    name="confirmPassword"
                    type="password" 
                    className="form-control" 
                    id="confirmPassword" 
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
            </div>
            <div className="mb-3 text-center">
                {/* <Link to="/login" className="btn btn-link text-dark-1" >Login</Link> */}
                <button disabled={!confirmed || loading} type="submit" className={`btn bg-primary-1 px-3`}>Change</button>
            </div>
        </form>
    </Fragment>

  )
}

export default AccountPassword