import { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import {
  clearErrors,
  myTasks,
  updateTask,
  updateTaskProgress,
} from "../../../actions/taskAction";
import PropTypes from "prop-types";
import { useHistory, useLocation } from "react-router-dom";
import { UPDATE_TASK_PROGRESS_RESET } from "../../../constants/taskConstants";

const WorkerTask = () => {
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

  const updateEscrow = (message) => {
    message.role = 'worker';
    dispatch(updateTaskProgress(message));
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
  _id,
  getColor,
  escrow,
  firstName, lastName, avatar,
  updateEscrow,
  getButtonText,
  getStatusUpdate
}) => {
  const message = {
    taskId: _id,
    status: getStatusUpdate(getButtonText(escrow.worker)),
  };

  const displayStatus = "Accepted Declined Completed Abandoned".includes(escrow.worker) || escrow.user==="Cancelled";
  const displayActionBtn = "Pending Accepted".includes(escrow.worker) && escrow.user!=="Cancelled";
  const statusInfo = escrow.user==="Cancelled"? escrow.user:escrow.worker==="Accepted"?"In progress":escrow.worker;
  const action = status => updateEscrow({status, taskId:_id})
  return (
    <div
      className="row bg-secondary-4 mb-1 mx-0"
      // onClick={() => history.push({ pathname: "/progress", state: task })}
    >
      <div className=" col-3 text-center my-auto">
        <div className="avatar">
          <img src={avatar.url} alt="" />
        </div>
      </div>
      <div className="col-9 py-1 gx-1 my-auto">
        <div className="d-flex align-items-center ">
            <h5 className="mb-0">
                <small>{`${firstName} ${lastName}`}</small>
            </h5>
            <div className="ms-2">
                <i class="fa fa-phone my-auto text-primary-1" aria-hidden="true"></i>
            </div>
            <span className="ms-auto badge text-dark fst-italic my-auto fw-normal">5 mins ago</span>
        </div>
        <p className="mb-0 lh-sm fw-light">
          <small>Request to perform electrical bulb installation and wall socket installation</small>
        </p>
        <div className="d-flex">
            {/* WORKER: Pending, Accepted||Declined, Completed||Abandoned */}
            {displayStatus &&
                <p className="mb-0 me-auto fw-light">
                    <em>
                        <small>{statusInfo}</small>
                    </em>
                    <i
                        className={`fa fa-circle ps-1 ${getColor(escrow.worker)}`}
                        style={{ "font-size": "10px" }}
                        aria-hidden="true"
                    ></i>
                </p>}
            
            {displayActionBtn && 
            <div className="mt-1">
                <button 
                    type="button" 
                    className={`btn btn-sm p-sm-2 px-sm-3 me-1 accept`} 
                    onClick={()=>action(escrow.worker==='Pending'? 'Accepted':'Completed')}
                    > {escrow.worker==='Pending'? 'Accept':'Completed'}
                </button>
                <button 
                    type="button" 
                    className={`btn btn-sm p-sm-2 px-sm-3 me-1 decline`} 
                    onClick={()=>action(escrow.worker==='Pending'? 'Declined':'Abandoned')}
                    > {escrow.worker==='Pending'? 'Decline':'Abandon'}
                </button>
            </div>}
        </div>
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
export default WorkerTask;
