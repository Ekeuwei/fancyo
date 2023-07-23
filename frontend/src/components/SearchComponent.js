import { Fragment, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import Search from "./layout/Search";
import SearchItem from "./SearchItem";
import WorkRequestModal from "./modal/WorkRequestModel";
import Loader from "./layout/Loader";
import LocationPicker from "./modal/LocationPicker";
import { useDispatch } from "react-redux";
import { Accordion } from "react-bootstrap";
import { getWorkers } from "../actions/workerActions";

const SearchComponent = ({ keyword, workers, count, loading }) => {
  const dispatch = useDispatch();

  const history = useHistory();
  const viewArtisan = (id) => history.push(`/worker/${id}`);
  const [show, setShow] = useState(false);
  const showWorkRequestModal = () => setShow(true);
  const hideWorkRequestModal = () => setShow(false);

  let location = JSON.parse(localStorage.getItem("location"));
  location = location?.state?.sn? `${location.town.name}, ${location.lga.name}, ${location.state.name}`: "Nigeria"
  location = location.trim().replace(/^( *, *)*(.*?)( *, *)*$/g, '$2')
  

  const handleFilter = data => {
    localStorage.setItem("location", JSON.stringify(data))
    // Request workers with the changed location
    dispatch(getWorkers(keyword, 1, data.state?.sn, data.lga?.sn, data.town?.name))        
    handleClose();
  }

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

  return (
    <Fragment>
      <div className="container">
        {isOpen&& <LocationPicker handleClose={handleClose} handleFilter={handleFilter} loading={loading} />}
        <div className="mt-3">
          <Route render={({ history }) => <Search history={history} />} />
          <div className="d-flex">

          <p className="text-dark-2 ms-3" onClick={handleOpen}>
            <i className="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
            <u style={{cursor:"pointer"}}>{location}</u>
          </p>
          </div>
        </div>
        
        {loading? <Loader /> : 
        <Fragment>
          <h5 className="py-1">{`${count===0?'No':count} worker${count>1?"s":""} found near you`}</h5>
          
          <div className="row gx-3">
            {workers &&
              workers.map((worker) => (
                <SearchItem worker={worker} viewArtisan={viewArtisan} key={worker._id} />
              ))}
          </div>

          <CreateJobRequestAccordion showWorkRequestModal={showWorkRequestModal}/>
        
        </Fragment>}
      </div>
      <WorkRequestModal show={show} handleClose={hideWorkRequestModal}/>
    </Fragment>
  );
};

const CreateJobRequestAccordion = ({showWorkRequestModal})=>{
  return (
    <Accordion className="accord">
      <Accordion.Toggle className="head" eventKey="0">
        <span>&#128075; Can't Find the Right Worker?</span> 
        <i class="fa fa-angle-down fa-lg ms-auto" aria-hidden="true"></i>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey="0">
        <div className="accordion-body">
          <p>You can still get the job done by creating a job request and let skilled workers come to you with their bids.</p>
          <button className="btn bg-accent-1" onClick={showWorkRequestModal}>create job request</button>
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default SearchComponent;
