import { useAlert } from "react-alert";
import { clearErrors, createTaskRequst } from "../../actions/taskAction";
import { CREATE_TASK_RESET } from "../../constants/taskConstants";
import SearchDropdown from "../layout/SearchDropdown";
import { getLgas, getStates, getTowns } from "../../actions/prefsAction";

const { useState, useEffect } = require("react");
const { Modal } = require("react-bootstrap");
const { useDispatch, useSelector } = require("react-redux");

const WorkRequestModal = ({show, handleClose}) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, success, loading} = useSelector(state => state.taskRequest);
  
  const { states, lgas, towns } = useSelector(state => state.prefs);

  const [details, setDetails] = useState({
    description: '',
    budget: '',
    numberOfWorkers: 1
  })

  const [contact, setContact] = useState({
    state: '',
    lga: '',
    town: ''
  })
  const onChange = e => setDetails(prevDetails => ({...prevDetails, [e.target.name]:e.target.value}))
  
  const itemSelected = (value, field) => setContact(prev => ({...prev, [field]: value}))
  
  const submitHandler = ()=>{
    details.location = {
      state: contact.state._id,
      lga: contact.lga._id,
      town: contact.town.name,
    }
    dispatch(createTaskRequst(details));
  }
  useEffect(()=>{
    if(error){
        alert.error(error);
        dispatch(clearErrors());
    }

    if(success){
        setDetails({
            description: '',
            location: '',
            budget: '',
            numberOfWorkers: 1
        });
        handleClose();
        alert.success("Request has been sent");
        dispatch({type: CREATE_TASK_RESET});
    }
  }, [error, success, dispatch, alert, setDetails, handleClose])
  
  useEffect(()=> dispatch(getStates()), 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [])

  useEffect(()=>{
    if(contact.state._id){
        dispatch(getLgas(contact.state._id))
    }
  }, [dispatch, contact.state._id])

  useEffect(()=>{
      if(contact.lga._id){
          dispatch(getTowns(contact.lga._id))
      }
  }, [dispatch, contact.lga._id])

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
          <label for="workOder" className="form-label">
            Enter the service you want to perform:
          </label>
          <div className="input">
            <textarea
            id="workOder"
            name="description"
            placeholder="e.g. clean the house, fix the car, etc."
            value={details.description}
            onChange={onChange}
            rows="2"
          />
          </div>
        </div>
        <div className="mb-3">
          <label for="location" className="form-label">
            Enter location:
          </label>
          <div className={`input mb-3 ${!contact.state.name ?'shake':''}`}>
                <SearchDropdown 
                    validateField={true} 
                    value={contact.state} 
                    name={'state'} 
                    itemSelected = { itemSelected }
                    onChange={itemSelected} 
                    suggestions={states} 
                    placeholder='State' />
            </div>
            <div className={`input mb-3 ${!contact.lga.name ?'shake':''}`}>
                <SearchDropdown 
                    validateField={true} 
                    value={contact.lga} 
                    name={'lga'} 
                    itemSelected = { itemSelected }
                    onChange={itemSelected} 
                    suggestions={lgas} 
                    placeholder='Lga' />
            </div>
            <div className={`input mb-3`}>
                <SearchDropdown 
                    value={contact.town} 
                    name={'town'}
                    itemSelected = { itemSelected }
                    onChange={itemSelected} 
                    suggestions={towns} 
                    placeholder='Town' />
            </div>
        </div>
        <div className="mb-3">
          <label for="numberOfWorkers" className="form-label">
            Number of workers needed:
          </label>
          <div className="input">
            <input
              type="number"
              id="numberOfWorkers"
              name="numberOfWorkers"
              value={details.numberOfWorkers}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="mb-3">
          <label for="budget" className="form-label">
            Enter budget per worker (optional):
          </label>
          <div className="input">
            <span className="text-secondary">₦</span>
            <input
              type="text"
              className="amount"
              id="budget"
              name="budget"
              value={details.budget}
              onChange={onChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button type="button" className={`btn bg-primary-1 ${loading&& 'loading'}`} disabled={loading} onClick={submitHandler}>
          Create Request
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default WorkRequestModal;