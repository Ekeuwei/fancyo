import { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  myTasks,
  updateTask,
  updateTaskProgress,
} from "../../actions/taskAction";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router-dom";
import { UPDATE_TASK_PROGRESS_RESET } from "../../constants/taskConstants";

const Task = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { tasks, loading } = useSelector((state) => state.myTasks);
  const { error, isUpdated } = useSelector((state) => state.singleTask);
  const { user } = useSelector((state) => state.auth);

  const getColor = (status) => {
    if (status === "In Progress") return "text-primary-1";
    if (status === "Canceled") return "text-danger";
    if (status === "Finished") return "text-orange";
    if (status === "Completed") return "text-success";
    return "text-dark-3";
  };

  const getButtonText = (status) => {
    // switch (status) {
    //   case 'Canceled': return 'Report';
    //   case 'Pending': return 'Cancel';

    //     break;

    //   default:
    //     break;
    // }
    // if (status === "In Progress") return "Review";
    if (status === "Canceled") return "Report";
    if (status === "Pending") return "Cancel";
    return "Approve";
  };

  const getStatusUpdate = (status) => {
    switch (status) {
      case "Cancel":
        return "Cancelled";
      case "Approve":
        return "Confirmed";
      case "Accept":
        return "In Progress";
      case "Abandon":
        return "Abandoned";

      default:
        return status;
    }
  };

  const updateEscrow = (data) => {
    data.uid = user._id;
    data.role = 'user';
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

    dispatch(myTasks(location.pathname));
  }, [alert, dispatch, location.pathname, isUpdated, error]);

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
          tasks.map((task) => (
            <SingeTask
              key={task._id}
              task={task}
              {...task.user} {...task.worker}
              {...task}
              updateEscrow={updateEscrow}
              history={history}
              getColor={getColor}
              getStatusUpdate={getStatusUpdate}
              getButtonText={getButtonText}
            />
          ))}
      </div>
    </Fragment>
  );
};

const SingeTask = ({
  task,
  title,
  _id,
  getColor,
  escrow,
  firstName, lastName, avatar,
  updateEscrow,
  getButtonText,
  getStatusUpdate,
  history,
}) => {
  const displayButton =
    escrow.worker === "Pending" ||
    (escrow.worker === "Finished" && escrow.user !== "Confirmed")
      ? ""
      : "d-none";
  const message = {
    taskId: _id,
    status: getStatusUpdate(getButtonText(escrow.worker)),
  };
  return (
    <div
      className="row bg-secondary-4 mb-1 mx-0 py-1"
      // onClick={() => history.push({ pathname: "/progress", state: task })}
    >
      <div className=" col-3 text-center my-auto">
        <div className="avatar">
          <img src={avatar.url} alt="" />
        </div>
      </div>
      <div className="col-6 py-2 gx-1 my-auto">
        <h5 className="mb-0">
          <small>{`${firstName} ${lastName}`}</small>
        </h5>
        <p className="mb-0 lh-sm fw-light">
          <small>{`Work Order: ${title}`}</small>
        </p>
        <p className="mb-0 fw-light">
          <em>
            <small>{escrow.worker}</small>
          </em>
          <i
            className={`fa fa-circle ps-1 ${getColor(escrow.worker)}`}
            style={{ "font-size": "10px" }}
            aria-hidden="true"
          ></i>
        </p>
      </div>
      <div className="col-3 text-center my-auto">
        <button
          type="button"
          className={`btn btn-sm p-sm-2 px-sm-3 ${displayButton} ${
            escrow.artisan === "Pending" ? "bg-dark-3" : "bg-primary-1"
          } rounded-3`}
          onClick={() => updateEscrow(message)}
        >
          {`${getButtonText(escrow.worker)}`}
        </button>
      </div>
    </div>
  );
};

SingeTask.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  artisan: PropTypes.object.isRequired,
};

SingeTask.defaultProps = {
  title: "Default Title",
  status: "Pending",
  artisan: {
    firstName: "Smart",
    lastName: "Walker",
    avatar: { url: `${window.location.origin}/images/avatar.png` },
  },
};
export default Task;
