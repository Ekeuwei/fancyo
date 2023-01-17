import React, { Fragment, useState, useContext, createContext } from "react";
import { Link, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../layout/Loader";
import MetaData from "../layout/MetaData";
import EngageUser from "../modal/EngageUser";
import { Modal } from "react-bootstrap";
import { useAlert } from "react-alert";
import { useEffect } from "react";
import { getArtisanDetails, clearErrors } from "../../actions/artisanAction";
import { newTask } from "../../actions/taskAction";
import { NEW_TASK_RESET } from "../../constants/taskConstants";

const ArtisanContext = createContext();

const ArtisanDetails = ({ match, history }) => {
  const { user } = useSelector((state) => state.auth);

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const alert = useAlert();
  const dispatch = useDispatch();

  const [jobOrder, setJobOrder] = useState({
    workOrder: "",
    taskLocation: "",
    duration: "",
    waitTime: "",
  });

  const { workOrder, taskLocation, duration, waitTime } = jobOrder;

  const onChange = (e) =>
    setJobOrder({ ...jobOrder, [e.target.name]: e.target.value });

  const { loading, artisan, error } = useSelector(
    (state) => state.artisanDetails
  );
  const { error: requestError, success } = useSelector(
    (state) => state.taskRequest
  );

  const submitRequest = () => {
    const formData = new FormData();
    formData.set("title", workOrder);
    formData.set("location", taskLocation);
    formData.set("duration", duration);
    formData.set("waitTime", waitTime);
    formData.set("user", user._id);
    formData.set("artisan", artisan._id);

    dispatch(newTask(formData));

    handleClose();
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      history.push("/");
      dispatch(clearErrors());
    }

    if (requestError) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Request sent successfully");
      dispatch({ type: NEW_TASK_RESET });
    }

    dispatch(getArtisanDetails(match.params.id));
  }, [dispatch, alert, error, success, requestError, history, match.params.id]);

  return (
    <ArtisanContext.Provider
      value={{
        handleClose,
        show,
        workOrder,
        onChange,
        taskLocation,
        submitRequest,
      }}
    >
      {loading || typeof artisan.firstName == "undefined" ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Profile"} />
          <div class="container-0">
            <div class="rounded-bottom row g-0">
              <div class="col-12 col-md-7">
                <div class="position-relative ms-lg-3">
                  <img
                    src={`${window.location.origin}/images/featured.png`}
                    class="card-img-bottom"
                    alt="..."
                  />
                  <div class="featured-graphics">
                    <div className="avatar">
                      <img
                        src={artisan.avatar.url}
                        alt={`${artisan.name}_Photo`}
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="card-body featured-heading"
                  style={{ width: "fit-content" }}
                >
                  <div class="row my-auto">
                    <h5 class="card-title text-primary-1 col-12 mb-2">
                      {`${artisan.firstName} ${artisan.lastName}`}
                      <span class="text-dark-2">
                        {" "}
                        {`| ${artisan.category}`}
                      </span>
                    </h5>
                    <div className="d-flex mb-2">
                      <i
                        class="fa fa-map-marker me-2 my-auto"
                        aria-hidden="true"
                      ></i>
                      <p class="card-text col mb-0">{`${artisan.contact.address}, ${artisan.contact.city}, ${artisan.contact.state}`}</p>
                    </div>

                    <div className="d-flex mb-2">
                      <i
                        class="fa fa-phone me-2 my-auto"
                        aria-hidden="true"
                      ></i>
                      <p class="card-text col mb-0">{`0${artisan.phoneNumber}`}</p>
                    </div>

                    <span class="col">
                      <button
                        type="button"
                        class="btn btn-sm bg-primary-2 px-4 px-md-3 py-md-1 text-white rounded-pill"
                        onClick={handleShow}
                      >
                        <strong>Engage</strong>
                      </button>
                    </span>
                  </div>
                </div>

                <div class="card-body">
                  <h5 class="card-text">Brief Intro</h5>
                  <p class="card-text">
                    Hi there, I’m 16 years old. I run errands and dispatch and I
                    do it with pleasure. I’m very much familiar with the
                    nooks... More
                  </p>
                </div>

                <div class="card-body">
                  <h5 class="card-text">My Services</h5>
                  <ul class="card-text d-flex flex-wrap list-unstyled text-center">
                    <li
                      class="bg-primary-2 badge rounded-pill col mt-1 me-1 px-3 text-nowrap"
                      style={{ "max-width": "fit-content" }}
                    >
                      Dispatch
                    </li>
                    <li
                      class="bg-secondary-1 badge rounded-pill col mt-1 me-1 px-3 text-nowrap"
                      style={{ "max-width": "fit-content" }}
                    >
                      Errands
                    </li>
                    <li
                      class="bg-secondary-3 badge rounded-pill col mt-1 me-1 px-3 text-nowrap"
                      style={{ "max-width": "fit-content" }}
                    >
                      Delivery
                    </li>
                    <li
                      class="bg-secondary-4 badge rounded-pill col mt-1 me-1 px-3 text-nowrap"
                      style={{ "max-width": "fit-content" }}
                    >
                      Pick-up
                    </li>
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
                      <div class="col me-2">
                        Average time to arrive job premises
                      </div>
                      <div class="col my-auto">30 minutes</div>
                    </li>
                    <li class="d-flex list-group-item ">
                      <div class="col me-2">Status</div>
                      <div class="col">Available</div>
                    </li>
                    <li class="d-flex list-group-item ">
                      <div class="col me-2">KYC</div>
                      <div class="col">
                        <i
                          class="fa fa-check-circle text-success"
                          aria-hidden="true"
                        ></i>
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
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        4.7 Rating (483)
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <strong>RECENT REVIEWS</strong>
                    </li>
                    <li class="list-group-item">
                      <span class="col">
                        <strong>Dennis Igwe</strong>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <p class="col">
                        Rebecca is simply amazing, she’s what I think of
                        whenever I want to get something done on time
                      </p>
                    </li>
                    <li class="list-group-item">
                      <span class="col">
                        <strong>Okafor Martins</strong>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <p class="col">
                        This is demn fast, he got the job done about 3 times
                        faster than I thought.
                      </p>
                    </li>
                    <li class="list-group-item">
                      <span class="col">
                        <strong>Jennifer Austin</strong>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star text-primary-1"
                          aria-hidden="true"
                        ></i>
                        <i
                          class="fa fa-star-half text-primary-1"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <p class="col">
                        It was nice working with you, but you should work on
                        your appearance - it’s not professional
                      </p>
                    </li>
                    <li class="list-group-item text-end mb-3 border-0">
                      <Link to="#">More</Link>
                    </li>
                    <button
                      type="button"
                      class="btn bg-primary-2 text-white"
                      onClick={handleShow}
                    >
                      <strong>Engage</strong>
                    </button>
                  </ul>
                </div>
              </div>
            </div>
            <WorkOrderModal />
          </div>
        </Fragment>
      )}
    </ArtisanContext.Provider>
  );
};

const WorkOrderModal = () => {
  const {
    handleClose,
    show,
    workOrder,
    onChange,
    taskLocation,
    submitRequest,
  } = useContext(ArtisanContext);
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Work Order</Modal.Title>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>
      <Modal.Body>
        {/* <EngageUser /> */}
        {/* <Fragment>             */}
        <div class="mb-3">
          <label for="workOder" class="form-label">
            What I’m I doing for you?
          </label>
          <textarea
            class="form-control"
            id="workOder"
            name="workOrder"
            value={workOrder}
            onChange={onChange}
            rows="3"
          />
          <ul class="card-text d-flex flex-wrap list-unstyled text-center">
            <li
              class="col mt-1 me-1 px-2 text-nowrap"
              style={{ "max-width": "fit-content" }}
            >
              Suggestion:
            </li>
            <li
              class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap"
              style={{ "max-width": "fit-content" }}
            >
              Dispatch Job
            </li>
            <li
              class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap"
              style={{ "max-width": "fit-content" }}
            >
              Errands Job
            </li>
            <li
              class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap"
              style={{ "max-width": "fit-content" }}
            >
              Delivery Job
            </li>
            <li
              class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap"
              style={{ "max-width": "fit-content" }}
            >
              Pick-up Job
            </li>
          </ul>
        </div>
        <div class="mb-3">
          <label for="taskLocation" class="form-label">
            Where I’m I performing the job?
          </label>
          <input
            type="text"
            class="form-control"
            id="taskLocation"
            name="taskLocation"
            value={taskLocation}
            onChange={onChange}
            placeholder="Amarata"
          />
        </div>
        <div class="mb-3">
          <label class="d-block form-label">
            How long do you want to engage me?
          </label>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="duration"
              onChange={onChange}
              id="fullDay"
              value="Full Day"
            />
            <label class="form-check-label" for="fullDay">
              Full Day
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="duration"
              onChange={onChange}
              id="asLongAsPossible"
              value="As Long as possible"
            />
            <label class="form-check-label" for="asLongAsPossible">
              As Long as possible
            </label>
          </div>
        </div>
        <div class="mb-3">
          <label class="d-block form-label">
            I'm currently completing a task! How long can you wait?
          </label>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="waitTime"
              onChange={onChange}
              id="30minutes"
              value={Date.now() + 30 * 60 * 1000}
            />
            <label class="form-check-label" for="30minutes">
              30 Minutes
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input
              class="form-check-input"
              type="radio"
              name="waitTime"
              onChange={onChange}
              id="whenDone"
              value={Date.now() + 24 * 60 * 60 * 1000}
            />
            <label class="form-check-label" for="whenDone">
              Till you're done
            </label>
          </div>
          {/* <p className="my-3">This worker is expected to arrive the job premises within 30 minutes from time of request. However, you can alter the timing to indicate the urgency of the job.</p> */}
        </div>
        {/* </Fragment> */}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" class="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button type="button" class="btn bg-primary-1" onClick={submitRequest}>
          Send Request
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArtisanDetails;
