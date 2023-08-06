import { useState } from "react";
import UpdateButton from "../../layout/UpdateButton";
import { formatAmount, formatTime } from "../../Utils";
import { useAlert } from "react-alert";
import { updateTaskProgressLocal } from "../../../actions/taskAction";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

const TaskRequestItemUserView = ({task, action, userMode, tabDirection})=>{
    // const view = label(task.status);
    const displayButton = worker => worker.escrow.user === "Completed"? "Review":label(worker.escrow.worker).txt
    const handleUpdate = (details) => action(details);
    
    return (
        <>
            {task.workers.length>1||task.applicants.length>0?
            (<>
                <div className='jobrequest-item timeline'>
                    <div className="jobrequest--content">
                        <div className="title-containter">
                            <h5 className='single-line'>{task.title}</h5>
                            <p>{formatTime(task.createdAt)}</p>
                        </div>
                        <p className='message'>{task.description}</p>
                        <h6>{`Rate: ${formatAmount(task.rate.value)}`}</h6>
                    </div>
                </div>
                <div className="timeline-list">
                    {task.workers?.map(taskWorker => 
                    (<GroupWorkers 
                        key={taskWorker._id} 
                        taskWorker={taskWorker} 
                        taskId={task._id} 
                        displayButton={displayButton} 
                        handleUpdate={handleUpdate} 
                        task={task}
                        time={task.createdAt} 
                        userMode={userMode} 
                        rate={task.rate}
                        tabDirection={tabDirection} 
                        review={taskWorker.review} />))}
                    
                    {task.applicants?.map(taskApplicant => 
                    (<Applicant 
                        key={taskApplicant._id} 
                        taskApplicant={taskApplicant} 
                        taskId={task._id} 
                        displayButton={displayButton} 
                        handleUpdate={handleUpdate} 
                        task={task}
                        time={task.createdAt} 
                        userMode={userMode} 
                        tabDirection={tabDirection} 
                        review={taskApplicant.review} />))}
                </div>
            </>):
            (task.workers.length===1 && 
                <SingleWorker 
                    singleWorker={task.workers[0]} 
                    task={task} 
                    displayButton={displayButton} 
                    handleUpdate={handleUpdate} 
                    userMode={userMode} 
                    tabDirection={tabDirection}
                    review={task.workers[0].review} />)}
        </>
)}


const GroupWorkers = ({taskWorker, taskId, displayButton, task, time, userMode, tabDirection, review})=>{
    const view = label(taskWorker.escrow.worker)
    const details = {
        taskId,
        workerId: taskWorker.worker._id,
        status: view.action
    }

    // const { userMode, tabDirection } = useContext(ManageJobsContext)
    const [showImage, setShowImage] = useState(true)
    const handleCall = ()=> window.location.href = `tel:${taskWorker.worker.owner.phoneNumber}`

    return(
        <div className="timeline-item">
            <div className="jobrequest-item timeline-bullet">
                {showImage&& <div className="avatar" style={{maxWidth: '50px', paddingBottom: '50px'}}>
                    <img 
                        src={taskWorker.worker.owner.avatar.url} 
                        alt={taskWorker.worker.owner.firstName} 
                        onLoad={()=>setShowImage(true)} 
                        onError={()=>setShowImage(false)}
                    />
                </div>}
                <div className="jobrequest--content">
                    <div className="title-containter">
                        <h5 className='single-line text-dark-2'>
                            <i className="fa fa-user me-1" aria-hidden="true"></i>
                            {`${taskWorker.worker.owner.firstName} ${taskWorker.worker.owner.lastName}`}</h5>
                        <p></p>
                    </div>
                    {taskWorker.worker.owner.phoneNumber&&<div className="mt-2 text-dark-2">
                            <h6 onClick={handleCall}><i className="fa fa-phone fa-lg me-1 text-grey" aria-hidden="true" ></i>{taskWorker.worker.owner.phoneNumber}</h6> 
                        </div>}
                    <div className="jobrequest--action">
                        <i className={view.i} aria-hidden="true" style={{fontSize: "10px"}}></i>
                        <h6 className='single-line mb-0 me-auto'><em>{view.status}</em></h6>
                        <UpdateButton 
                            updateDetails={details} 
                            view={{...view, txt:`${displayButton(taskWorker)}` }} 
                            task={task}
                            userMode={userMode} 
                            tabDirection={tabDirection} 
                            workerId={taskWorker.worker._id}
                            taskWorker={taskWorker} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const Applicant = ({taskApplicant, task, taskId, displayButton, time, userMode, tabDirection, review})=>{
    const view = label('Request') //Task.status
    const details = {
        taskId,
        workerId: taskApplicant.worker._id,
        status: view.action
    }

    // const { userMode, tabDirection } = useContext(ManageJobsContext)
    const [showImage, setShowImage] = useState(true)

    return(
        <div className="timeline-item">
            <div className="jobrequest-item timeline-bullet">
                {showImage&& <div className="avatar" style={{maxWidth: '50px', paddingBottom: '50px'}}>
                    <img 
                        src={taskApplicant.worker.owner.avatar.url} 
                        alt={taskApplicant.worker.owner.firstName} 
                        onLoad={()=>setShowImage(true)} 
                        onError={()=>setShowImage(false)}
                    />
                </div>}
                <div className="jobrequest--content">
                    <div className="title-containter">
                        <h5 className='single-line'>{`${taskApplicant.worker.owner.firstName} ${taskApplicant.worker.owner.lastName}`}</h5>
                        <p>{formatTime(taskApplicant.createdAt)}</p>
                    </div>
                    <div className="jobrequest--action">
                        <em><p className="message">{taskApplicant.message}</p></em>
                        <UpdateButton 
                            updateDetails={details} 
                            view={{...view, txt:`${view.txt}` }} 
                            task={task}
                            userMode={userMode} 
                            tabDirection={tabDirection} 
                            workerId={taskApplicant.worker._id}
                            taskWorker={taskApplicant} />
                    </div>
                </div>
            </div>
        </div>
    )
}
const SingleWorker = ({singleWorker, userMode, task, tabDirection, displayButton, review})=>{
    const view = label(singleWorker.escrow.worker)
    const details = {
        taskId: task._id,
        workerId: singleWorker.worker._id,
        status: view.action
    }
    const [showModal, setShowModal] = useState(false);

    const [showImage, setShowImage] = useState(true)
    const handleCall = ()=> window.location.href = `tel:${singleWorker.worker.owner.phoneNumber}`

    return(
        <div className="jobrequest-item">
            {showImage&& <div className="avatar">
                <img 
                    src={singleWorker.worker.owner.avatar.url} 
                    alt={singleWorker.worker.owner.firstName} 
                    onLoad={()=>setShowImage(true)} 
                    onError={()=>setShowImage(false)}
                />
            </div>}
            <div className="jobrequest--content">
                <div className="title-containter">
                    <h5 className='single-line'>{`${task.title} Job`}</h5>
                    <p>{formatTime(task.createdAt)}</p>
                </div>
                <p className='message'>{task.description}</p>
                <h6>
                    <i className="fa fa-user me-1 text-grey" aria-hidden="true"></i>
                    {`${singleWorker.worker.owner.firstName} ${singleWorker.worker.owner.lastName} `}
                </h6>
                {singleWorker.worker.owner.phoneNumber&&<div>
                    <h6 onClick={handleCall}><i className="fa fa-phone fa-lg me-1 text-grey" aria-hidden="true" ></i>{singleWorker.worker.owner.phoneNumber}</h6> 
                </div>}
                <h6>{`Rate: ${formatAmount(task.rate.value)}`}</h6>
                <div className="jobrequest--action">
                    <i className={view.i} aria-hidden="true" style={{fontSize: "10px"}}></i>
                    <h6 className='single-line mb-0 me-auto'><em>{view.status}</em></h6>
                    <UpdateButton 
                        updateDetails={details} 
                        view={{...view, txt: `${displayButton(singleWorker)}`}} 
                        userMode={userMode} 
                        task={task}
                        tabDirection={tabDirection} 
                        workerId={singleWorker.worker._id} 
                        taskWorker={singleWorker} />
                    {/* <button onClick={()=>setShowModal(true)}>Show Modal</button> */}
                </div>
                {showModal&&<ConfirmPaymentModal workerId={singleWorker.worker._id} task={task} show={showModal} onHide={() => setShowModal(false)}/>}
            </div>
        </div>
    )
}

export const ConfirmPaymentModal = (props)=> {
    const alert = useAlert()
    
    const [loading, setLoading] = useState(false)

    const { walletBalance } = useSelector(state => state.wallet)
    const [cashPayment, setCashPayment] = useState(true);
    const invalidPaymentOption = !cashPayment&& walletBalance < props.task.rate.value;

    const submitHandler = async()=>{
        const taskDetails = {
            taskId: props.task._id,
            workerId: props.workerId,
            paymentOption: cashPayment?'cash':'wallet',
            status: 'Completed'
        }
        setLoading(true);

        const { success, error } = await updateTaskProgressLocal(taskDetails);
        
        if(success){
            alert.success('Status Updated');
        }
        if(error){
            alert.error(error);
        }

        setLoading(false);

        props.onHide();

        // dispatch(userMode? myTasks(tabDirection):myWorks(tabDirection))

    }


    return (
        <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
            Pay Worker
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <img className="money" src="/images/money.png" alt="" />
            <h4 className="text-center">{`${formatAmount(props.task.rate.value)}`}</h4>
        </Modal.Body>
            <div className="selection_payment">
                <button className={`btn ${cashPayment?'selected':'notselected'}`} onClick={()=> setCashPayment(true)}>
                    {cashPayment&&<i class="fa fa-check-circle me-2 text-secondary-3" aria-hidden="true"></i> }Pay with cash</button>
                <button className={`btn ${!cashPayment?'selected':'notselected'}`} onClick={()=> setCashPayment(false)}>
                    {!cashPayment&&<i class="fa fa-check-circle me-2 text-secondary-3" aria-hidden="true"></i>} Pay from Balance</button>
            </div>
            {invalidPaymentOption &&<p className="mx-3 text-danger">Your wallet balance is insufficient topup or pay with pash</p>}
            {false&&<>
                <h6>GTB: 0236334534</h6>
                <h6>Opay: 8030572700</h6>
                <h6>Moniepoint MFB: 80006442392</h6>
                <h6>You can use any of our autogenerated virtual account numbers to top up your wallet and any money transferred to these account numbers would be credited to your wallet automatically.</h6>
            </>}
            <button disabled={invalidPaymentOption} className={`btn bg-secondary-3 mx-3 mb-2 ${loading?'loading':''}`} onClick={submitHandler}>Confirm Payment</button>
        </Modal>
    );
}

const label = (status)=>{
    // 'Pending', 'Cancelled', 'Completed', 'In Progress','Abandoned'
    switch (status) {
        case 'Accepted':
            return {
                i: 'fa fa-circle text-orange me-1',
                btn: 'bg-dark-3 btn d-none',
                txt: 'Cancel',
                status: 'In Progress',
                action: 'Cancelled'
            }
        case 'Pending':
            return {
                i: 'fa fa-circle text-dark-3 me-1',
                btn: 'bg-dark-3 btn',
                txt: 'Cancel',
                status,
                action: 'Cancelled'
            }
        case 'Completed':
            return {
                i: 'fa fa-circle text-success me-1',
                btn: 'btn bg-secondary-3',
                txt: 'Confirm',
                status,
                action: 'Completed'
            }
        case 'Request':
            return {
                i: 'fa fa-circle text-success me-1',
                btn: 'btn bg-secondary-3',
                txt: 'Assign Task',
                status,
                action: 'Pending'
            }
    
        default:
            return {
                i: 'fa fa-circle text-dark-3 me-1',
                btn: 'btn bg-dark-3 d-none',
                txt: 'Cancel',
                status: `${status} by worker`,
                action: 'Cancelled'
            }
    }
}

export default TaskRequestItemUserView;