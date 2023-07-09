import React from "react";

const TaskProgress = () => {
  
  const task = 
    {
      "escrow": {
        "user": "Pending",
        "worker": "Pending"
      },
      "worker": {
        "pricing": {
          "minRate": 3000,
          "dailyRate": 5000
        },
        "_id": "649090bebe7f1342c99bcfc7"
      },
      "_id": "6493144ba154f1ddefcf5711",
      "location": {
        "state": "647744b387968b971280e06f",
        "lga": "647744b487968b971280e108",
        "town": "Amarata"
      },
      "title": "Delivery person",
      "description": "I need someone to deliver an item",
      "numberOfWorkers": 1,
      "summary": "Apply to deliver an item for me.",
      "budget": null,
      "user": {
        "avatar": {
          "public_id": "avatars/sbf3xdxbruutrffqytzn",
          "url": "https://res.cloudinary.com/rveasy-technologies-limited/image/upload/v1687000037/avatars/sbf3xdxbruutrffqytzn.jpg"
        },
        "_id": "64908f0e508940893bd0f12e",
        "firstName": "Ebi",
        "lastName": "Wilson"
      },
      "status": "Pending",
      "applicants": [],
      "createdAt": "2023-06-21T15:16:27.036Z",
      "__v": 2
    }
    
  return (
    <section>
      <div className="list-group m-3 list-group-flush">
        <div className="list-group-item">
          <h4>{task.title}</h4>
        </div>
        <div className="list-group-item">
          <p className="mb-2 3w-normal">Performed By</p>
          <span className="d-flex">
            <i
              className="fa fa-user-circle text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 className="col mb-0 text-uppercase">{`${task.user.firstName} ${task.user.lastName}`}</h6>
          </span>
        </div>
        <div className="list-group-item">
          <p className="mb-2 fw-normal">Task location</p>
          <span className="d-flex">
            <i
              className="fa fa-map-marker text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 className="col mb-0">{task.location.town}</h6>
          </span>
        </div>
        <div className="list-group-item">
          <p className="mb-2 fw-normal">Duration</p>
          <span className="d-flex">
            <i
              className="fa fa-clock-o text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 className="col mb-0">{'task.duration'}</h6>
          </span>
        </div>
        <div className="list-group-item">
          <p className="mb-2 fw-normal">Billing Format</p>
          <span className="d-flex">
            <i
              className="d-none fa fa-clock-o text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 className="col mb-0">Hourly</h6>
          </span>
        </div>
        <div className="list-group-item">
          <p className="mb-2 fw-normal">Amount</p>
          <span className="d-flex">
            <i
              className="fa fa-money text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 className="col mb-0">4,000.00</h6>
          </span>
        </div>
        <div className="list-group-item">
          <p className="mb-2 fw-normal">Status</p>
          <span className="d-flex">
            <i
              className="fa fa-hourglass text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 className="col mb-0">{task.status}</h6>
          </span>
        </div>
        <div className="col-3 text-center my-auto py-3">
          <button type="button" className="btn bg-primary-1 px-4 rounded-3">
            Stop
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaskProgress;
