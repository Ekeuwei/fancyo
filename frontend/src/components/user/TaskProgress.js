import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
const TaskProgress = () => {
  const location = useLocation();
  const [task, setTask] = useState(location.state);
  //   const task = location.state;
  return (
    <section>
      <div class="list-group m-3 list-group-flush">
        <div class="list-group-item">
          <h4>{task.title}</h4>
        </div>
        <div class="list-group-item">
          <p class="mb-2 3w-normal">Performed By</p>
          <span class="d-flex">
            <i
              class="fa fa-user-circle text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 class="col mb-0 text-uppercase">{`${task.artisan.firstName} ${task.artisan.lastName}`}</h6>
          </span>
        </div>
        <div class="list-group-item">
          <p class="mb-2 fw-normal">Task location</p>
          <span class="d-flex">
            <i
              class="fa fa-map-marker text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 class="col mb-0">{task.location}</h6>
          </span>
        </div>
        <div class="list-group-item">
          <p class="mb-2 fw-normal">Duration</p>
          <span class="d-flex">
            <i
              class="fa fa-clock-o text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 class="col mb-0">{task.duration}</h6>
          </span>
        </div>
        <div class="list-group-item">
          <p class="mb-2 fw-normal">Billing Format</p>
          <span class="d-flex">
            <i
              class="d-none fa fa-clock-o text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 class="col mb-0">Hourly</h6>
          </span>
        </div>
        <div class="list-group-item">
          <p class="mb-2 fw-normal">Amount</p>
          <span class="d-flex">
            <i
              class="fa fa-money text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 class="col mb-0">4,000.00</h6>
          </span>
        </div>
        <div class="list-group-item">
          <p class="mb-2 fw-normal">Status</p>
          <span class="d-flex">
            <i
              class="fa fa-hourglass text-primary-1 my-auto pe-3"
              aria-hidden="true"
            ></i>
            <h6 class="col mb-0">{task.escrow.artisan}</h6>
          </span>
        </div>
        <div class="col-3 text-center my-auto py-3">
          <button type="button" class="btn bg-primary-1 px-4 rounded-3">
            Stop
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaskProgress;
