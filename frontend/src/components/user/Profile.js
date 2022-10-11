import React, { Fragment, useState } from 'react'
import { Link, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import EngageUser from '../modal/EngageUser'
import { Modal } from 'react-bootstrap'

const Profile = () => {
    const { user, loading } = useSelector(state => state.auth)

    const [show, setShow] = useState(false);
    const handleShow = ()=> setShow(true);
    const handleClose = ()=> setShow(false);
    return (
        <Fragment>
            { loading ? <Loader /> : (
                <Fragment>
                    <MetaData  title={'Profile'} />
                    <div class="container-0">
                        <div class="rounded-bottom row g-0">

                            <div class="col-12 col-md-7">
                                <div class="position-relative ms-lg-3">
                                    <img src={`${window.location.origin}/images/featured.png`} class="card-img-bottom" alt="..."/>
                                    <div class="featured-graphics">
                                        <img class="rounded-circle w-100 mx-auto" src={`${window.location.origin}/images/avatar.png`} alt=""/>
                                    </div>
                                </div>
                    
                                <div class="card-body featured-heading" style={{width: "fit-content"}}>
                                    
                                    <div class="row my-auto">
                                        <h5 class="card-title text-primary-1 col-12 mb-2">Rebecca Jolie
                                            <span class="text-dark-2"> | Errand / Dispatch</span>
                                        </h5>
                                        <div className='d-flex mb-2'>                                            
                                            <i class="fa fa-map-marker me-2 my-auto" aria-hidden="true"></i>
                                            <p class="card-text col mb-0">67 Edepie School Road, Yenagoa Bayelsa State</p>
                                        </div>

                                        <div className='d-flex mb-2'>                                            
                                            <i class="fa fa-phone me-2 my-auto" aria-hidden="true"></i>
                                            <p class="card-text col mb-0">08023322234</p>
                                        </div>
                                        
                                        <span class="col">
                                            <button type="button" class="btn btn-sm bg-primary-2 px-4 px-md-3 py-md-1 text-white rounded-pill" onClick={handleShow}><strong>Engage</strong></button>
                                        </span>
                                    </div>
                                </div>
                    
                                <div class="card-body">
                                    <h5 class="card-text">Brief Intro</h5>
                                    <p class="card-text">Hi there, I’m 16 years old. I run errands and dispatch and I do it with pleasure. I’m very much familiar with the nooks... More</p>
                                </div>
                    
                                <div class="card-body">
                                    <h5 class="card-text">My Services</h5>
                                    <ul class="card-text d-flex flex-wrap list-unstyled text-center">
                                        <li class="bg-primary-2 badge rounded-pill col mt-1 me-1 px-3 text-nowrap" style={{"max-width": "fit-content"}}>Dispatch</li>
                                        <li class="bg-secondary-1 badge rounded-pill col mt-1 me-1 px-3 text-nowrap" style={{"max-width": "fit-content"}}>Errands</li>
                                        <li class="bg-secondary-3 badge rounded-pill col mt-1 me-1 px-3 text-nowrap" style={{"max-width": "fit-content"}}>Delivery</li>
                                        <li class="bg-secondary-4 badge rounded-pill col mt-1 me-1 px-3 text-nowrap" style={{"max-width": "fit-content"}}>Pick-up</li>
                                    </ul>
                                </div>
                            </div>

                            <div class="col-12 col-md-5">
                                <div class="card-body pt-md-0 pe-md-0">
                                    <ul class="list-group">
                                        <li class="list-group-item active">Highights</li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Joined Since</div>
                                            <div class="col">7th April, 2022</div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Total Jobs</div>
                                            <div class="col">787</div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Last Job</div>
                                            <div class="col">5 hours ago</div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Average time to arrive job premises</div>
                                            <div class="col">30 minutes</div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Status</div>
                                            <div class="col">Available</div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">KYC</div>
                                                <div class="col">
                                                    <i class="fa fa-check-circle text-success" aria-hidden="true"></i>
                                                    Verified
                                                </div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Pricing</div>
                                            <div class="col">N3,000/Hr</div>
                                        </li>
                                        <li class="d-flex list-group-item ">
                                            <div class="col me-2">Rating</div>
                                            <div class="col">
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                4.7 Rating (483)
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                    
                                <div class="card-body">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item"><strong>RECENT REVIEWS</strong></li>
                                        <li class="list-group-item">
                                            <span class="col">
                                                <strong>Dennis Igwe</strong>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                            </span>
                                            <p class="col">Rebecca is simply amazing, she’s what I think of whenever I want to get something done on time</p>
                                        </li>
                                        <li class="list-group-item">
                                            <span class="col">
                                                <strong>Okafor Martins</strong>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                            </span>
                                            <p class="col">This is demn fast, he got the job done about 3 times faster than I thought.</p>
                                        </li>
                                        <li class="list-group-item">
                                            <span class="col">
                                                <strong>Jennifer Austin</strong>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star text-primary-1" aria-hidden="true"></i>
                                                <i class="fa fa-star-half text-primary-1" aria-hidden="true"></i>
                                            </span>
                                            <p class="col">It was nice working with you, but you should work on your appearance - it’s not professional</p>
                                        </li>
                                        <li class="list-group-item text-end mb-3 border-0"><Link to="#">More</Link></li>
                                        <button type="button" class="btn bg-primary-2 text-white" onClick={handleShow}><strong>Engage</strong></button>
                                    </ul>
                                </div>
                            </div>                            
                        </div>
                    
                        <Modal show ={show} onHide ={handleClose} backdrop="static" keyboard={false}>
                            <Modal.Header>
                                <Modal.Title>Work Order</Modal.Title>
                                <button type="button" class="btn-close" aria-label="Close" onClick={handleClose}></button>
                            </Modal.Header>
                            <Modal.Body>
                                <EngageUser />
                            </Modal.Body>
                            <Modal.Footer>
                                <button type="button" class="btn btn-secondary" onClick={handleClose}>Cancel</button>
                                <button type="button" class="btn bg-primary-1">Send Request</button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </Fragment>
            )}
            
        </Fragment>
    )
}

export default Profile
