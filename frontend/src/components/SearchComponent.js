import { Fragment } from "react";
import { Route, useHistory } from "react-router-dom";
import Search from "./layout/Search";

const SearchComponent = ({ keyword, workers, count }) => {
  const history = useHistory();
  const viewArtisan = (e) => {
    const uid = e.currentTarget.getAttribute("uid");
    history.push(`/worker/${uid}`);
  };
  return (
    <Fragment>
      <div className="container">
        <div className="m-3">
          <Route render={({ history }) => <Search history={history} />} />
          <p className="text-dark-2 ms-3">
            <i className="fa fa-map-marker" aria-hidden="true"></i>
            Edepie, Yenagoa
          </p>
        </div>
        <h5 className="py-3">{`${count} result${count>1?"s":""} found`}</h5>

        <div className="row gx-3">
          {workers &&
            workers.map((worker) => (
              <div
                className="col-6 col-sm-4 col-md-3 col-lg-5 mb-3 text-center"
                style={{ "max-width": "16rem", "min-width": "11rem" }}
              >
                <div
                  onClick={viewArtisan}
                  uid={worker._id}
                  className="card mx-auto border-0 bg-secondary-2"
                >
                  <h5 className="card-title py-2 bg-primary-1 text-white">
                    {worker.category}
                  </h5>
                  <div className="w-50  mx-auto">
                    <div className="avatar">
                      <img
                        src={worker.owner.avatar.url}
                        alt={`${worker.owner.firstName}`}
                      />
                    </div>
                  </div>
                  <span>
                    <p className="m-0">
                      <strong className="me-2">{`${worker.owner.firstName} ${worker.owner.lastName}`}</strong>
                      <i
                        className="fa fa-check-circle text-success"
                        aria-hidden="true"
                      ></i>
                    </p>
                    <span className="text-primary-1 m-0">
                      <i className="fa fa-star" aria-hidden="true"></i>
                      <i className="fa fa-star" aria-hidden="true"></i>
                      <i className="fa fa-star" aria-hidden="true"></i>
                      <i className="fa fa-star" aria-hidden="true"></i>
                      <i className="fa fa-star" aria-hidden="true"></i>
                    </span>
                    <p>{`N${worker.pricing.amount} / ${worker.pricing.billingCycle}`}</p>
                  </span>
                  <div className="text-start ps-2">
                    <p className="mb-1">
                      {`Status: ${worker.availability}`}
                      <span className="position-relative ms-1">
                        <i
                          className="position-absolute top-50 start-50 translate-middle text-secondary-3 fa fa-circle ms-1"
                          style={{ "font-size": "10px" }}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </p>
                    <p className="mb-1">{`Location: ${worker.owner.contact.city}`}</p>
                    <p>Experience: 20yrs+</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </Fragment>
  );
};

export default SearchComponent;
