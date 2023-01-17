import React, { Fragment } from 'react'
import { Link, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'

import Search from './Search'
import { logout } from '../../actions/userActions'

import '../../App.css'


const Header = () => {

    const alert = useAlert()
    const dispatch = useDispatch()

    const { isAuthenticated, user, loading } = useSelector(state => state.auth)

    const logoutHandler = ()=>{
        dispatch(logout());
        alert.success('Logged out successfully.')
    }

    return (
        <Fragment>
            <nav class="navbar navbar-expand-lg navbar-light bg-primary-1 sticky-top">
                <div class="container-fluid">
                    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i class="text-white fa fa-bars" aria-hidden="true"></i>
                    </button>
                    <Link to={'/'} class="text-white navbar-brand flex-md-grow-0 flex-grow-1 ps-2" >Ebiwani</Link>
                    <div class="order-1 ms-auto">
                        {isAuthenticated ? <NavLinks {...user} logoutHandler={logoutHandler}/>:
                                (<Fragment>
                                    <Link class="navbar-brand fs-6 text-white" to='/login'>Login</Link>
                                    <Link class="navbar-brand fs-6 text-white" to='/register'>Register</Link>
                                </Fragment>)
                        }
                        {/* <img src="./frontend/img/avatar.png" alt=""> */}
                    </div>
                
                    <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                    <li class="nav-item">
                        <Link to='#' class="nav-link active" aria-current="page" >Home</Link>
                    </li>
                    <li class="nav-item">
                        <Link to='#' class="nav-link" >Features</Link>
                    </li>
                    <li class="nav-item">
                        <Link to='#' class="nav-link" >Pricing</Link>
                    </li>
                    <li class="nav-item">
                        <Link to='#' class="nav-link disabled"  tabindex="-1" aria-disabled="true">Disabled</Link>
                    </li>
                    </ul>
                </div>
                </div>
            </nav>
        </Fragment>
    )
}

const NavLinks = ({avatar, firstName, logoutHandler, role})=>{
    return(
        <div class="d-block">
            <Link class="navbar-brand fs-6 text-white" to="/tasks">Task
                <i class="fa fa-circle text-success" style={{"font-size": "10px"}} aria-hidden="true"></i>
            </Link>
            
            <Link to="#" className="dropdown-toggle text-white text-decoration-none" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img class="rounded-circle me-2" src={avatar.url} style={{height: "2em"}} alt="" />
                <span>{firstName}</span>
            </Link>
            
            <ul class="dropdown-menu dropdown-menu-end bg-primary-1 m-0 border-0 end-0" aria-labelledby="dropdownMenu">
                <li><Link class="dropdown-item text-white" to="#">Dashboard</Link></li>
                <li><Link class="dropdown-item text-white" to="#">Account</Link></li>
                {role==='worker' && <li><Link class="dropdown-item text-white" to="/works">My Orders</Link></li>}
                <li><Link class="dropdown-item text-white" to="/" onClick={logoutHandler}>Logout</Link></li>
            </ul>
        </div>
    )
}

export default Header
