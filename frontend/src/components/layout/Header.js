import React, { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';


import { changeMode, logout } from '../../actions/userActions'

import '../../App.css'
import WorkRequestModal from '../modal/WorkRequestModel';


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
    const [show, setShow] = useState(false)
    const [showMenu, setShowMenu] = useState(true)
    const handleClose = ()=> setShow(false);
    const toggleMenu = ()=> setShowMenu(prev => !prev)
    return (
        <Fragment>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary-1 sticky-top">
                <div className={`container-fluid`}>
                    <OffcanvasExample 
                        user={user} 
                        logoutHandler={logoutHandler} 
                        switchMode={switchMode} 
                        userMode={userMode}
                        showMenu={showMenu}
                        toggleMenu={toggleMenu}
                        showModal={show}
                        setShow={setShow}
                        handleClose={handleClose} />
                    <Link to={'/'} className="text-white navbar-brand flex-md-grow-0 flex-grow-1 ps-2" >Ebiwoni</Link>
                    <div className="order-1 ms-auto">
                        {user?.role? <NavLinks {...user} logoutHandler={logoutHandler} switchMode={switchMode} userMode={userMode}/>:
                                (<Fragment>
                                    <Link className="navbar-brand fs-6 text-white" to='/login'>Login</Link>
                                    <Link className="navbar-brand fs-6 text-white" to='/register'>Register</Link>
                                </Fragment>)
                        }
                    </div>
                
                    <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to='#' className="nav-link active" aria-current="page" >Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='#' className="nav-link" >Find Workers</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='#' className="nav-link" >Contact Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='#' className="nav-link" >FAQs</Link>
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
            <Link to="/account/profile" className="text-white text-decoration-none" >
                <img className="rounded-circle me-2" src={avatar.url} style={{height: "2em"}} alt="" />
                <span>{firstName}</span>
            </Link>
            {/* <Link to="#" className="dropdown-toggle text-white text-decoration-none" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img className="rounded-circle me-2" src={avatar.url} style={{height: "2em"}} alt="" />
                <span>{firstName}</span>
            </Link> */}
            
            {/* <ul className="dropdown-menu dropdown-menu-end bg-primary-1 m-0 border-0 end-0" aria-labelledby="dropdownMenu">
                <li><Link className="dropdown-item text-white" to="/dashboard">Dashboard</Link></li>
                <li><Link className="dropdown-item text-white" to="/account/profile">Account</Link></li>
                {role === 'worker'&&<li className="dropdown-item text-white" onClick={switchMode}>{`${userMode?'Worker':'User'} Mode`}</li>}
                <li><Link className="dropdown-item text-white" to="/" onClick={logoutHandler}>Logout</Link></li>
            </ul> */}
        </div>
    )
}


function OffcanvasExample({user, logoutHandler, switchMode, userMode, role, handleClose, setShow, showMenu, toggleMenu, showModal}) {
    const offCanvasRef = useRef();
    const closeOffCanvas = () => offCanvasRef.current.backdrop.click();
    
    const closeOffCanvasOver = (meth)=>{
        closeOffCanvas()
        meth()
    }
  return (
    <>
      {[false].map((expand) => (
        <Navbar key={expand} expand={expand} className="bg-body-tertiary">
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
              ref={offCanvasRef}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                  Ebiwoni.com
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                    {user?.role?<>
                        {/* Users links */}
                        <Nav.Link onClick={closeOffCanvas} href="/dashboard">Dashboard</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="/account/profile">Account</Nav.Link>
                        
                        {user.userMode?<>
                            <Nav.Link onClick={()=>closeOffCanvasOver(setShow(true))}>Post a Job</Nav.Link>
                            <Nav.Link onClick={closeOffCanvas} href="/tasks">Opened Jobs</Nav.Link>
                            {user.role==="user"&&<Nav.Link onClick={closeOffCanvas} href="/account/worker">Create Worker Profile</Nav.Link>}
                        </>:<>
                            {/* Workers links */}
                            <Nav.Link onClick={closeOffCanvas} href="#">Task requests</Nav.Link>
                            <Nav.Link onClick={closeOffCanvas} href="/morejobs">Nearby Jobs</Nav.Link>
                        </>}

                        {user.role==="worker"&& <Nav.Link href="#"onClick={()=>closeOffCanvasOver(switchMode)}>
                            {`Switch to ${userMode?'Worker':'User'} Mode`}
                        </Nav.Link>}
                        
                        <Nav.Link onClick={()=>closeOffCanvasOver(logoutHandler)}>Logout</Nav.Link>
                    </>:<>
                        {/* Visitors links */}
                        <Nav.Link onClick={closeOffCanvas} href="#">Home</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">How It Works</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">FAQs</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">Find Workers</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">About Us</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">Contact Us</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">Terms of Service</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">Privacy Policy</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">Referral Program</Nav.Link>
                        <Nav.Link onClick={closeOffCanvas} href="#">Worker Sign-Up</Nav.Link>
                    </>}

                    
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      <WorkRequestModal show={showModal} handleClose={handleClose}/>

    </>
  );
}

export default Header
