import React, { Fragment, useState, useContext, createContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import { Modal } from "react-bootstrap";
import { useAlert } from "react-alert";
import { getWorkerDetails, clearErrors, getWorkerReviews } from "../../actions/workerActions";
import { getTasksReviews, newTask } from "../../actions/taskAction";
import { NEW_TASK_RESET } from "../../constants/taskConstants";
import dateFormat from "dateformat";
import { formatAmount } from "../Utils";
import SearchDropdown from "../layout/SearchDropdown";
import { getTowns } from "../../actions/prefsAction";
import RatingStars from "../layout/RatingStars";
import ErrorFetchingData from "../layout/ErrorFetchingData";

const WorkerContext = createContext();

const WorkerDetails = ({ match, history }) => {
    
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    
    const alert = useAlert();
    const dispatch = useDispatch();
    
    const { loading, worker, error } = useSelector((state) => state.workerDetails);
    const { error: requestError, success, loading:loadingReq } = useSelector((state) => state.taskRequest);
    const { reviews } = useSelector(state => state.review)
    
  useEffect(() => {
    if (error) {
      alert.error(error);
      history.push("/");
      dispatch(clearErrors());
    }

    if (requestError) {
      alert.error(requestError);
      dispatch(clearErrors());
      handleClose();
    }

    if (success) {
      alert.success("Request sent successfully");
      handleClose();
      dispatch({ type: NEW_TASK_RESET });
    }

    dispatch(getWorkerDetails(match.params.id));
  }, [dispatch, alert, error, success, requestError, history, match.params.id]);

  useEffect(()=>{
    dispatch(getWorkerReviews(match.params.id))
  }, [])

  const { towns } = useSelector(state => state.prefs);
    
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState({
    state:'', lga:'', town:''
  });
   
  useEffect(()=>{
    setLocation({
      state:worker?.owner?.contact?.town?.state, 
      lga:worker?.owner?.contact?.town?.lga, 
      town:worker?.owner?.contact?.town
    })
  }, [worker])

  useEffect(()=>{
    
    if(location?.lga){
      dispatch(getTowns(location.lga._id))
    }

  }, [dispatch, location.lga])

  const submitRequest = () => {
    const data = {
      location: {
        state:location.state._id, 
        lga:location.lga._id, 
        town:location.town.name
      },
      description,
      worker: worker._id
    }

    dispatch(newTask(data));

  };
  
  return (
    <WorkerContext.Provider
      value={{
        handleClose,
        show,
        pricing:worker?.pricing,
        description,
        setDescription,
        location,
        towns,
        setLocation,
        submitRequest,
        loading: loadingReq
      }}
    >
      <Fragment>
        <MetaData title={"Worker Profile"} />

        {loading || loading === undefined? <Loader /> : <div className="container-0">
            <div className="rounded-bottom row g-0">
            {worker?.status?<div className="col-12 col-md-7">
              {/* Start */}
              <div className="featured-graphics">
                <img 
                    src={worker.featuredGraphics?.url || `${window.location.origin}/images/featured.png`}
                    alt="featured Graphics"
                  />
              </div>
              <div className="featured-graphics-avatar">
                <img 
                    src={worker.owner.avatar.url}
                    name="avatar"
                    alt={`${worker.displayName}_Photo`}
                  />
            </div>
              {/* End */}

              <div
                className="card-body featured-heading"
                style={{ width: "fit-content" }}
                >
                <div className="row my-auto">
                    <h5 className="card-title text-primary-1 col-12 mb-2">
                    {`${worker.owner.firstName} ${worker.owner.lastName}`}
                    <span className="text-dark-2">
                        {` | ${worker.category.name}`}
                    </span>
                    </h5>
                    <div className="d-flex mb-2">
                    <i
                        className="fa fa-map-marker me-2 my-auto"
                        aria-hidden="true"
                    ></i>
                    <p className="card-text col mb-0">{`${worker.owner?.contact?.address}, ${worker.owner?.contact?.town?.name}, ${worker.owner?.contact?.town?.lga?.name}`}</p>
                    </div>

                    <div className="d-flex mb-2">
                    <i
                        className="fa fa-phone me-2 my-auto"
                        aria-hidden="true"
                    ></i>
                    <p className="card-text col mb-0">{`${worker.owner.phoneNumber}`}</p>
                    </div>

                    <span className="col">
                    <button
                        type="button"
                        className="btn btn-sm bg-primary-2 px-4 px-md-3 py-md-1 text-white rounded-pill"
                        onClick={handleShow}
                    >
                        <strong>Engage</strong>
                    </button>
                    </span>
                </div>
                </div>
            </div>:<ErrorFetchingData />}

            <div className="col-12 col-md-5">
                <div className="card-body pt-md-0 pe-md-0">
                <ul className="list-group">
                    <li className="list-group-item active">Highights</li>
                    <li className="d-flex list-group-item ">
                      <div className="col">Joined Since</div>
                      <div className="col">{dateFormat(worker.createdAt, "dS mmm, yyyy")}</div>
                    </li>
                    <li className="d-flex list-group-item ">
                      <div className="col">Status</div>
                      <div className="col">{worker.availability}</div>
                    </li>
                    <li className="d-flex list-group-item ">
                      <div className="col">KYC</div>
                      <div className="col">
                          {worker.status}
                          {worker.status === "verified"&&<i className="fa fa-check-circle text-success ms-1" aria-hidden="true" ></i>}
                      </div>
                    </li>
                    <li className="d-flex list-group-item ">
                      <div className="col">Pricing</div>
                      <div className="col">{`${formatAmount(worker.pricing.minRate)} - ${formatAmount(worker.pricing.dailyRate)}`}</div>
                    </li>
                    <li className="d-flex list-group-item ">
                    <div className="col">Rating</div>
                    <div className="col">
                        <i className="fa fa-star text-primary-1 me-1" aria-hidden="true" ></i>
                        {`${worker.ratings} Rating (${worker.numOfReviews})`}
                    </div>
                    </li>
                </ul>
                </div>

                {reviews?.length>0&&<div className="card-body">
                  <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                      <strong>RECENT REVIEWS</strong>
                      </li>
                      {reviews.map(review => (<li className="list-group-item">
                        <span className="col">
                            <strong className="me-1">{review.name}</strong>
                            <RatingStars rating={review.rating}/>
                        </span>
                        <p className="col">
                            {review.comment}
                        </p>
                      </li>))}
                      {reviews?.length > 5&&<li className="list-group-item text-end mb-3 border-0">
                        <Link to="#">More</Link>
                      </li>}
                      <button
                      type="button"
                      className="btn bg-primary-2 text-white"
                      onClick={handleShow}
                      >
                      <strong>Engage</strong>
                      </button>
                  </ul>
                </div>}
            </div>
            </div>
            <WorkOrderModal />
        </div>}
      </Fragment>
    </WorkerContext.Provider>
  );
};

const WorkOrderModal = () => {
  const {
    handleClose,
    show,
    description,
    setDescription,
    location,
    setLocation,
    towns,
    loading,
    pricing,
    submitRequest,
  } = useContext(WorkerContext);
  
  const onChange = (value, name) => setLocation(prev => ({...prev, [name]:value}))

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Work Order</Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="workOder" className="form-label">
            What I’m I doing for you?
          </label>
          <textarea
            className="form-control"
            id="workOder"
            name="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows="2"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Where I’m I performing the job?
          </label>
          <div className="input">
            {towns&& <SearchDropdown 
              suggestions={towns}
              itemSelected={onChange}
              value={location.town}
              name={'town'}
              placeholder={'Location'}
              onChange={onChange}
            />}
            <span className="text-secondary">{` | ${location?.lga?.name}, ${location?.state?.name} State.`}</span>
          </div>
        </div>
        <div className="mb-3 attention">
          <h5>ATTENTION</h5>
          <ul>
            <li>{formatAmount(pricing.minRate)} is my minimum charge for a job </li>
            <li>{formatAmount(pricing.dailyRate)} for full day engagement </li>
            <li>Other payment arrangements are negotiable</li>
          </ul>

        </div>
        {/* </Fragment> */}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button type="button" className={`btn bg-primary-1 ${loading&&'loading'}`} onClick={submitRequest}>
          Send Request
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkerDetails;
