import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'

import { changeMode, logout } from '../../actions/userActions'

import '../../App.css'


const Header = () => {

    const alert = useAlert()
    const dispatch = useDispatch()

    let user;
    try {
        user = JSON.parse(localStorage.getItem('user'));
        
    } catch (error) {
        
    }

    const logoutHandler = ()=>{
        dispatch(logout());
        alert.success('Logged out successfully.')
    }
    const switchMode = ()=> dispatch(changeMode());
    const userMode = JSON.parse(localStorage.getItem('userMode'));

    return (
        <Fragment>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary-1 sticky-top">
                <div className={`container-fluid`}>
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="text-white fa fa-bars" aria-hidden="true"></i>
                    </button>
                    <Link to={'/'} className="text-white navbar-brand flex-md-grow-0 flex-grow-1 ps-2" >Ebiwani</Link>
                    <div className="order-1 ms-auto">
                        {user?.role? <NavLinks {...user} logoutHandler={logoutHandler} switchMode={switchMode} userMode={userMode}/>:
                                (<Fragment>
                                    <Link className="navbar-brand fs-6 text-white" to='/login'>Login</Link>
                                    <Link className="navbar-brand fs-6 text-white" to='/register'>Register</Link>
                                </Fragment>)
                        }
                        {/* <img src="./frontend/img/avatar.png" alt=""> */}
                    </div>
                
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to='#' className="nav-link active" aria-current="page" >Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='#' className="nav-link" >Features</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='#' className="nav-link" >Pricing</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='#' className="nav-link disabled"  tabIndex="-1" aria-disabled="true">Disabled</Link>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
        </Fragment>
    )
}

const NavLinks = ({avatar, firstName, logoutHandler, switchMode, userMode, role})=>{
    return(
        <div className="d-block">
            <Link className="navbar-brand fs-6 text-white" to="/tasks">Task
                <i className="fa fa-circle text-success" style={{"fontSize": "10px"}} aria-hidden="true"></i>
            </Link>
            
            <Link to="#" className="dropdown-toggle text-white text-decoration-none" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img className="rounded-circle me-2" src={avatar.url} style={{height: "2em"}} alt="" />
                <span>{firstName}</span>
            </Link>
            
            <ul className="dropdown-menu dropdown-menu-end bg-primary-1 m-0 border-0 end-0" aria-labelledby="dropdownMenu">
                <li><Link className="dropdown-item text-white" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item text-white" to="/account/profile">Account</Link></li>
                {role === 'worker'&&<li className="dropdown-item text-white" onClick={switchMode}>{`${userMode?'Worker':'User'} Mode`}</li>}
                <li><Link className="dropdown-item text-white" to="/" onClick={logoutHandler}>Logout</Link></li>
            </ul>
        </div>
    )
}

export default Header
