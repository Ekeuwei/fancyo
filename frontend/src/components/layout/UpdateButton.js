import React, { useState } from 'react'
import { useAlert } from 'react-alert';
import { myTasks, myWorks, updateTaskProgressLocal } from '../../actions/taskAction';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { getWallet } from '../../actions/userActions';
import RateWorker from '../user/RateWorker';
import { workerReview } from '../../actions/workerActions';

const UpdateButton = ({view, updateDetails, commission, userMode, tabDirection, workerId, taskWorker })=>{
    const [loading, setLoading] = useState(false);
    const alert = useAlert();
    const dispatch = useDispatch();

    const [show, setShow] = useState(false);
    const [rateWorker, setRateWorker] = useState(false);

    const handleCancel = ()=> setShow(false);
    const handleClose = ()=> setRateWorker(false);

    const buttonClicked = ()=> {

        if(!userMode && updateDetails.status==='Accepted'){
            
            setShow(true);

        }else if(userMode && updateDetails.status==='Completed'){
            
            setRateWorker(true)

        }else{

            handleUpdate()

        }
    }
    
    const handleUpdate = async (ratings)=> {
        setLoading(true);

        if(ratings){

            dispatch(workerReview(ratings))

        }

        const { success, error } = await updateTaskProgressLocal(updateDetails);
        
        if(success){
            alert.success('Status Updated');
        }
        if(error){
            alert.error(error);
        }

        setLoading(false);
        setShow(false);
        setRateWorker(false);

        dispatch(userMode? myTasks(tabDirection):myWorks(tabDirection))
        
        if(updateDetails.status==='Accepted'){

            dispatch(getWallet())
        }

    }
    
    return(
        <>
            <button className={`${view.btn} ${loading?'loading':''}`} 
                onClick={buttonClicked} 
                disabled={loading}>

                    {view.txt}

            </button>
            <DebitConfirmationModal 
                show={show} 
                loading={loading} 
                handleConfirm={handleUpdate} 
                handleCancel={handleCancel}
                commission={commission}
            />

            {rateWorker&& <RateWorker 
                show={rateWorker} 
                loading={loading} 
                handleUpdate={handleUpdate} 
                handleCancel={handleClose}
                workerId={workerId}
                taskId={updateDetails.taskId}
                taskWorker={taskWorker}
            />}
        </>
    )
}

const DebitConfirmationModal = ({show, loading, handleConfirm, handleCancel, commission})=>{
    return (
        <Modal show={show} onHide={handleCancel} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>Attention!!!</Modal.Title>
                <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCancel}
                ></button>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3 text-center">
                    <p>{`₦${commission} will be debited from your account.`}</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
                </button>
                <button type="button" className={`btn bg-primary-1 ${loading? 'loading':''}`} disabled={loading} onClick={handleConfirm}>
                Confirm
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default UpdateButton