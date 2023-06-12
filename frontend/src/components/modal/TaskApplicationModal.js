import { useAlert } from "react-alert";
import { taskWorkerApplication } from "../../actions/taskAction";

const { useState } = require("react");
const { Modal } = require("react-bootstrap");

const TaskApplicationModal = ({workerProfiles, taskId, show, handleClose}) => {
  const alert = useAlert();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    profileId: workerProfiles[0]._id,
    message: '',
  })
  const onChange = e => setDetails(prevDetails => ({...prevDetails, [e.target.name]:e.target.value}))
  const submitHandler = async ()=> {

    setLoading(true)
    
    const { error, success} = await taskWorkerApplication({...details, taskId});

    if(error){
      alert.error(error);
    }

    if(success){
      alert.success('Application submitted')
    }

    setLoading(false);
    handleClose();
  }
  
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Create Work Request</Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={handleClose}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label for="location" className="form-label">
            Select work profile:
          </label>
          <div className="input">
            <select 
                aria-label="Select Work Profile" 
                name="profileId"
                value={details.profileId}
                onChange={onChange} >
                {workerProfiles.map(profile => <option key={profile._id} value={profile._id}>{profile.category.name}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label for="message" className="form-label">
            Additional message (Optional):
          </label>
          <div className="input">
            <textarea
            id="message"
            name="message"
            value={details.message}
            onChange={onChange}
            rows="2"
          />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button type="button" className={`btn bg-primary-1 ${loading&& 'loading'}`} disabled={loading} onClick={submitHandler}>
          Apply
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskApplicationModal;