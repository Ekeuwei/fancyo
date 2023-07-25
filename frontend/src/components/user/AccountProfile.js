import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { clearErrors, loadUser, updateProfile } from '../../actions/userActions';
import { useAlert } from 'react-alert';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';


const AccountProfile = () => {
    const alert = useAlert();
    const history = useHistory();
    const dispatch = useDispatch();
    const { loading, error, isUpdated } = useSelector(state => state.user);
    const currentUser = JSON.parse(localStorage.getItem('user'))
    
    const [user, setUser] = useState({
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        email: currentUser?.email,
        phoneNumber: currentUser?.phoneNumber,
        gender: currentUser?.gender
    })

    useEffect(()=>{
        if(error){
            dispatch(clearErrors())
            alert.error(error)
        }

        if(isUpdated){
            alert.success("Updated Successfully");
            dispatch({type: UPDATE_PROFILE_RESET});
            dispatch(loadUser());
        }
    }, [dispatch, alert,isUpdated, error]);
    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value })

    const submitHandler = (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.set('data', JSON.stringify(user));
        dispatch(updateProfile(formData));
    }
  return (
    <Fragment>
        <SectionBreadcrumbs section={{title:'Profile', subTitle:'Update your profile details'}}/>
        <Tabs history={history}/>
        <form className='mx-3' onSubmit={submitHandler}>
            <div className="mb-3">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input 
                    type="name" 
                    name="firstName" 
                    className="form-control" 
                    id="firstName" 
                    value={user.firstName}
                    onChange={onChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input 
                    name="lastName"
                    type="name" 
                    className="form-control" 
                    id="lastName" 
                    value={user.lastName}
                    onChange={onChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="state" className="form-label">Gender</label>
                <select 
                    className="form-select" 
                    aria-label="Select State" 
                    name="gender"
                    value={user.gender}
                    onChange={onChange} >
                    <option selected>Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="number" className="form-label">Phone Number</label>
                <input 
                    name="phoneNumber"
                    type="phone" 
                    className="form-control" 
                    id="number"
                    value={user.phoneNumber}
                    onChange={onChange}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input 
                    name="email"
                    type="email" 
                    className="form-control" 
                    id="email" 
                    value={user.email}
                    onChange={onChange}
                />
            </div>
            <div className="mb-3 text-center">
                {/* <Link to="/login" className="btn btn-link text-dark-1" >Login</Link> */}
                <button disabled={loading} type="submit" className={`btn bg-primary-1 px-3`}>Save</button>
            </div>
        </form>
    </Fragment>

  )
}
export const SectionBreadcrumbs = ({section})=>{
    const user = JSON.parse(localStorage.getItem("user"))
    return(
        <div className="account-breadcrumbs">
            <img className="rounded-circle me-2" src={user.avatar.url} style={{height: "3em"}} alt="" />
            <div className="breadcrumbs-title">
                <span><strong>{`${user.firstName} ${user.lastName}`}</strong> / <strong>{section.title}</strong></span>
                <p className='mb-0'>{section.subTitle}</p>
            </div>
        </div>
    )
}

export const Tabs = ({history})=>{
    const tabs = ['Profile', 'Contact', 'Password', 'Worker']
    return(
        <div className="tabs">
            <ul className='tabs-list'>
                {tabs.map(tab=>{
                    const path = `/account/${tab.toLocaleLowerCase()}`;
                    return <Link className={`tab-item ${path===history.location.pathname? 'item-selected':''}`} key={tab} to={path}>{tab}</Link>
                })}
            </ul>
        </div>
    )
}

export default AccountProfile