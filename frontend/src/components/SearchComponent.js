import { Fragment, useState } from "react";
import { Route, useHistory } from "react-router-dom";
import Search from "./layout/Search";
import SearchItem from "./SearchItem";
import WorkRequestModal from "./modal/WorkRequestModel";

const SearchComponent = ({ keyword, workers, count }) => {
  const history = useHistory();
  const viewArtisan = (e) => {
    const uid = e.currentTarget.getAttribute("uid");
    history.push(`/worker/${uid}`);
  };
  const [show, setShow] = useState(false);
  const showWorkRequestModal = () => setShow(true);
  const hideWorkRequestModal = () => setShow(false);
  return (
    <Fragment>
      <div className="container">
        <div className="m-3 text-center">
          <h4>Electrician</h4>
        </div>
        <div className="m-3">
          <Route render={({ history }) => <Search history={history} />} />
          <div className="d-flex">

          <p className="text-dark-2 ms-3">
            <i className="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
            Edepie, Yenagoa
          </p>
            <button className='btn btn-secondary ms-auto' onClick={showWorkRequestModal}>
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              create work request</button>
          </div>
        </div>
        <h5 className="py-3">{`${count} worker${count>1?"s":""} found near you`}</h5>
        
        <div className="row gx-3">
          {workers &&
            workers.map((worker) => (
              <SearchItem worker={worker} viewArtisan={viewArtisan} key={worker._id} />
            ))}
        </div>
      </div>
      <WorkRequestModal show={show} handleClose={hideWorkRequestModal}/>
    </Fragment>
  );
};



export default SearchComponent;
