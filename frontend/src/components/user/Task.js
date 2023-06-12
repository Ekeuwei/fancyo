import { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  myTasks,
  updateTaskProgress,
} from "../../actions/taskAction";
import PropTypes from "prop-types";
import { UPDATE_TASK_PROGRESS_RESET } from "../../constants/taskConstants";

const Task = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { tasks, loading } = useSelector((state) => state.myTasks);
  const { error, isUpdated } = useSelector((state) => state.singleTask);

  const getColor = (status) => {
    if (status === "In Progress") return "text-primary-1";
    if (status === "Canceled") return "text-danger";
    if (status === "Finished") return "text-orange";
    if (status === "Completed") return "text-success";
    return "text-dark-3";
  };

  const getButtonText = (status) => {
    if (status === "Canceled") return "Report";
    if (status === "Pending") return "Cancel";
    return "Approve";
  };

  const getStatusUpdate = (status) => {
    switch (status) {
      case "Cancel":
        return "Cancelled";
      case "Approve":
        return "Completed";
      case "Accept":
        return "In Progress";
      case "Abandon":
        return "Abandoned";

      default:
        return status;
    }
  };

  const updateEscrow = (data) => {
    dispatch(updateTaskProgress(data));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Task Updated");
      dispatch({ type: UPDATE_TASK_PROGRESS_RESET });
    }

    dispatch(myTasks());
  }, [alert, dispatch, isUpdated, error]);

  return (
    <Fragment>
      <div className="list-group m-2">
        <div className="d-flex list-group-item bg-primary-1 mb-1 align-items-center">
          <h3 className="my-auto">Job Orders</h3>
          <span className="ms-auto me-1">
            <i className="fa fa-sliders fa-lg" aria-hidden="true"></i>
          </span>
        </div>

        {tasks &&
          tasks.map((task) => task.workers.length>0 && (
            <SingeTask
              key={task._id}
              {...task.workers[0].worker} {...task.workers[0]}
              {...task}
              getColor={getColor}
              updateEscrow={updateEscrow}
              getButtonText={getButtonText}
              getStatusUpdate={getStatusUpdate}
              loading={loading}
            />
          ))}
      </div>
    </Fragment>
  );
};

const SingeTask = ({
  description,
  _id,
  escrow,
  workers,
  getColor,
  updateEscrow,
  getButtonText,
  getStatusUpdate,
  loading
}) => {
  const displayButton =
    workers[0].escrow.worker === "Pending" ||
    (workers[0].escrow.worker === "Finished" && escrow.user !== "Confirmed")
      ? ""
      : "d-none";
  const message = {
    taskId: _id,
    workerId: workers[0]._id,
    status: getStatusUpdate(getButtonText(workers[0].escrow.worker)),
  };
  return (
    <div
      className="row bg-secondary-4 mb-1 mx-0 py-1"
      // onClick={() => history.push({ pathname: "/progress", state: task })}
    >
      <div className=" col-3 text-center my-auto">
        <div className="avatar">
          <img src={workers[0].worker.owner.avatar.url} alt="" />
        </div>
      </div>
      <div className="col-6 py-2 gx-1 my-auto">
        <h5 className="mb-0">
          <small>{`${workers[0].worker.owner.firstName} ${workers[0].worker.owner.lastName}`}</small>
        </h5>
        <p className="mb-0 lh-sm fw-light">
          <small>{`Work Order: ${description}`}</small>
        </p>
        <p className="mb-0 fw-light">
          <em>
            <small>{workers[0].escrow.worker}</small>
          </em>
          <i
            className={`fa fa-circle ps-1 ${getColor(workers[0].escrow.worker)}`}
            style={{ fontSize: "10px" }}
            aria-hidden="true"
          ></i>
        </p>
      </div>
      <div className="col-3 text-center my-auto">
        <button
          type="button"
          className={`btn btn-sm p-sm-2 px-sm-3 ${loading?'loading':''} ${displayButton} ${
            escrow.worker === "Pending" ? "bg-dark-3" : "bg-primary-1"
          } rounded-3`}
          onClick={() => updateEscrow(message)}
        >
          {`${getButtonText(workers[0].escrow.worker)}`}
        </button>
      </div>
    </div>
  );
};

SingeTask.propTypes = {
  description: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  artisan: PropTypes.object.isRequired,
};

SingeTask.defaultProps = {
  description: "Default Title",
  status: "Pending",
  artisan: {
    firstName: "Smart",
    lastName: "Walker",
    avatar: { url: `${window.location.origin}/images/avatar.png` },
  },
};
export default Task;
