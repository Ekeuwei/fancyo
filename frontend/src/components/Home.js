import React, { Fragment, useEffect, useState } from 'react'
import Pagination from 'react-js-pagination'
import 'rc-slider/assets/index.css'; // Import the default design of the slider

import MetaData from './layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import SearchComponent from './SearchComponent';
import Search from './layout/Search';
import { Route, useHistory } from 'react-router-dom';
import { getWorkers } from '../actions/workerActions';


const Home = ({ match }) => {

    const [currentPage, setCurrentPage] = useState(1)
    const history = useHistory();

    const categories = [
        {name: 'General Labour', url: 'labour', image:'./images/labour.png'},
        {name: 'Plumbing', url: 'plumbing', image:'./images/plumbing.png'},
        {name: 'Electrician', url: 'electrician', image:'./images/electrician.png'},
        {name: 'Make-up', url: 'makeup', image:'./images/makeup.png'},
        {name: 'House Keeper', url: 'housekeeper', image:'./images/errand.png'},
    ]

    const alert = useAlert();
    
    const dispatch = useDispatch();

    const {  loading, workers, error, workersCount, resPerPage, filteredWorkersCount } = useSelector(state => state.workers)

    const keyword = match.params.keyword

    useEffect( ()=> {

        if(error){
            return  alert.error(error)
        }
         
        dispatch(getWorkers(keyword, currentPage))        

    }, [dispatch, alert, error, keyword, currentPage])

    function setCurrentPageNo(pageNumber){
        setCurrentPage(pageNumber)
    }

    let count = workersCount;
    if(keyword){
        count = filteredWorkersCount
    }



    return (
        <Fragment>
            {!loading&& (            
                <Fragment>        
                    <MetaData title= {'Getting Things Done with Good Help'} />
                    {keyword? <SearchComponent keyword = {keyword} workers = {workers} count = {count}/> : (
                        <Fragment>
                            <section >
                                <div className="p-5 bg-img h-l-50">
                                    <h3 className="mb-4 text-white">Find the right worker for any task, easily and quickly</h3>
                                    <p className="mb-4 text-white">Free up your time and energy by letting professionals handle your personal tasks.</p>
                                    <div className="mx-md-5">
                                        <Route render={ ({history}) => <Search history = {history} />} />
                                    </div>       
                                    
                                </div>
                            </section>

                            <section>
                                <div className="bg-white p-3">
                                    <h3 className="color-dark-2 mb-3">Popular Services</h3>
                                    <div className="container-fluid ps-0 overflow-auto row gx-3 pb-2 flex-nowrap">
                                        {categories.map(category => (
                                            <div className="col-10 col-sm-9 col-md-6 col-lg-4 col-xl-3 position-relative" key={category.name} onClick={()=>history.push(`category/${category.url}`)}>
                                                <h5 className="text-light position-absolute top-0 end-0 m-3">{category.name}</h5>
                                                <img className="w-100 h-100 fit-cover rounded-3" src={category.image} alt={category.name}/>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="row bg-secondary-4 p-3 text-dark-2">
                                    <h3 className="text-md-center mb-3">You’re just one call away from getting that job done.</h3>
                                    <div className="col-12 col-lg-6">
                                        <div>            
                                            <h5 className="mb-1">
                                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                                Find a taskman or post a job
                                            </h5>
                                            <p>Find someone with the skill set for the job, e.g “carpenter” or make a job post for workers to bid.</p>
                                        </div>

                                        <div>            
                                            <h5 className="mb-1">
                                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                                Assign the Job
                                            </h5>
                                            <p>Engage a taskman to perform the job within the specified time.</p>
                                        </div>

                                        <div>            
                                            <h5 className="mb-1">
                                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                                Job Gets Done
                                            </h5>
                                            <p>The taskman performs the job as specified.</p>
                                        </div>

                                        <div>            
                                            <h5 className="mb-1">
                                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                                Job Gets Inspected
                                            </h5>
                                            <p>Inpsect your job and ensure performance meets your expectations.</p>
                                        </div>

                                        <div>            
                                            <h5 className="mb-1">
                                                <i className="fa fa-check-circle" aria-hidden="true"></i>
                                                Payment Disbursment
                                            </h5>
                                            <p>Cash payment is made and remitted to the task worker.</p>
                                        </div>
                                    </div>

                                    <div className="col-12 col-lg-6 col-md-9 my-auto">
                                        <img className="img-fluid px-3" src="./images/vid.png" alt=""/>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <div className="containter p-3 text-center">
                                    <h4 className="mb-3 text-dark-2">Explore the Marketplace</h4>
                                    <div className="row gx-3">
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/carpentry.png" alt=""/>
                                            <p>Carpentry</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/makeup.png" alt=""/>
                                            <p>Make-up</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/electrical.png" alt=""/>
                                            <p>Electrical</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/welding.png" alt=""/>
                                            <p>Wedlding</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/catering.png" alt=""/>
                                            <p>Catering</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/errand.png" alt=""/>
                                            <p>Errand/Dispatch</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/labour.png" alt=""/>
                                            <p>General Labour</p>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <img className="img-fluid" src="./images/more.png" alt=""/>
                                            <p>More</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </Fragment>
                    )}
                    
                    {(resPerPage <= count || currentPage !==1) && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination 
                                activePage = {currentPage}
                                itemsCountPerPage = {resPerPage}
                                totalItemsCount = {workersCount}
                                onChange = {setCurrentPageNo}
                                nextPageText = {'Next'}
                                prevPageText = {'Prev'}
                                firstPageText = {'First'}
                                lastPageText = {'Last'}
                                itemClass = "page-items"
                                linkClass = "page-link"
                            />
                        </div>
                    )}
                    

                </Fragment>
            )}
        </Fragment>
        
        
    )
}

export default Home
