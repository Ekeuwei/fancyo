import { useState } from "react";
import { formatAmount, formatTime } from "../../Utils";
import UpdateButton from "../../layout/UpdateButton";
import { Modal } from "react-bootstrap";
import { formatNumber } from "../../SearchItem";
import { myTasks, myWorks, updateTaskProgressLocal, updateTaskRate } from "../../../actions/taskAction";
import { useAlert } from "react-alert";
import { useDispatch } from "react-redux";

const defaultAvatar = `${window.location.origin}/images/avatar.png`


const TaskRequestItemWorkerView = ({task, userMode, tabDirection})=>{
    const view = label(task.escrow.worker);
    const taskConcluded = task.escrow.user === "Cancelled"||
                          "Completed, Declined".includes(task.escrow.worker);
    const pendingConfirmation = task.escrow.user!=="Completed" && task.escrow.worker === "Completed"
    const details = {
        taskId: task._id,
        workerId: task.worker._id,
        status: view.action
    }

    const commission = 100;//task.budget * 0.1 || task.worker.pricing.minRate * 0.1;
    const [showImage, setShowImage] = useState(true)

    const handleCall = ()=> window.location.href = `tel:${task.user.phoneNumber}`
    return (
        <div className="jobrequest-item">
            {showImage&& <div className="avatar">
                <img 
                    src={task.user.avatar?.url||defaultAvatar} 
                    alt={task.user.firstName} 
                    onLoad={()=>setShowImage(true)} 
                    onError={()=>setShowImage(false)}
                />
            </div>}
            <div className="jobrequest--content">
                <div className="title-containter">
                    <h5 className='single-line'>{`${task.title} Job`}</h5>
                    <p>{formatTime(task.createdAt)}</p>
                </div>
                <p className='message'>{task.summary||task.description}</p>
                <h6>
                    <i className="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
                    {`${task.location?.town}`}
                </h6>
                {task.user.phoneNumber&&<>
                    <h6>
                        <i className="fa fa-user me-1 text-grey" aria-hidden="true"></i>
                        {`${task.user.firstName} ${task.user.lastName} `}
                    </h6>
                    <h6 onClick={handleCall}><i className="fa fa-phone fa-lg me-1 text-grey" aria-hidden="true" ></i>{task.user.phoneNumber}</h6> 
                </>}

                <h6>{`Rate: ${formatAmount(task.rate.value)}`}</h6>

                {taskConcluded ? 
                <h6 className='single-line mb-0'><em>
                    <i className={view.i} aria-hidden="true" style={{fontSize: "10px"}}></i>
                    {pendingConfirmation?"Pending confirmation":view.txt}</em>
                </h6>:
                <>
                    {task.user.phoneNumber&& !task.rate?.agreed?
                    <UpdateRate task={task} taskConcluded={taskConcluded} userMode={userMode} tabDirection={tabDirection} />:
                    <div className={`jobrequest--action ${taskConcluded? 'd-none':''}`}>
                        <UpdateButton task={task} updateDetails={{...details, status:view.action.confirm}} view={{ txt:view.txt.confirm, btn:view.btn }} commission={commission} userMode={userMode} tabDirection={tabDirection} />
                        <UpdateButton task={task} updateDetails={{...details, status:view.action.decline}} view={{ txt:view.txt.decline, btn:'btn decline' }} commission={commission} userMode={userMode} tabDirection={tabDirection} />
                    </div>}
                </>}
            </div>
        </div>
)}

const UpdateRate = ({task, taskConcluded, userMode, tabDirection})=> {
    const [showModal, setShowModal] = useState(false);
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [commenceJob, setCommenceJob] = useState(false);
    
    const handleAction = (commence)=>{
        setCommenceJob(commence)
        setShowModal(true)
    }
    
    return (
        <div className={`jobrequest--action ${taskConcluded? 'd-none':''}`}>
            {task.rate.postedBy==="worker"? 
            <h6><em>Awaiting user to accept the new job rate</em></h6> : 
            <>
                <button className="btn bg-secondary-3" onClick={()=>handleAction(true)}>Commence Job</button>
                {task.rate.finalRate?<button className="btn bg-dark-2" onClick={()=>setShowConfirmCancel(true)}>Cancel Job</button>:
                <button className="btn bg-primary-1" onClick={()=>handleAction(false)}>Change Rate</button>}
            </>}
            <CenteredModal show={showModal} onHide={() => setShowModal(false)} task={task} taskId={task._id} rate={task.rate} userMode={userMode} tabDirection={tabDirection} commence={commenceJob}/>
            <ConfirmCancellation show={showConfirmCancel} task={task} onHide={() => setShowConfirmCancel(false)} userMode={userMode} tabDirection={tabDirection}/>
        </div>
    )
}
const ConfirmCancellation = (props)=>{
    const alert = useAlert()
    const dispatch = useDispatch()
    
    const cancelMsg = "Are you sure you want to cancel this job?"
    const [loading, setLoading] = useState(false)

    const declineDetails = {
        taskId: props.task._id,
        workerId: props.task.worker._id,
        status: "Cancelled"
    }

    const submitHandler = async()=>{
        
        
        setLoading(true);

        const { success, error } = await updateTaskProgressLocal(declineDetails)
        
        if(success){
            alert.success(success.message);
        }
        if(error){
            alert.error(error);
        }

        setLoading(false);

        props.onHide();

        dispatch(props.userMode? myTasks(props.tabDirection):myWorks(props.tabDirection))

    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter"> Cancel Job </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <p>{cancelMsg}</p>
        </Modal.Body>
            <button className={`btn decline mx-3 mb-2 ${loading?'loading':''}`} onClick={submitHandler}>Cancel Job</button>
        </Modal>
    );
}

function CenteredModal(props) {
    const alert = useAlert()
    const dispatch = useDispatch()
    
    const commenceMsg = `By Commencing, you acknowledge that you will be paid at the rate of ${formatAmount(props.rate.value)} for this job.`
    const updateRateMsg = "Please contact the user to gather more details about the job and negotiate the rate before requesting an update."

    const [rate, setRate] = useState('');
    const [loading, setLoading] = useState(false)


    const submitHandler = async()=>{
        
        const amount = props.commence? props.rate.value : rate;
        
        setLoading(true);

        const { success, error } = await updateTaskRate(props.taskId, amount);
        
        if(success){
            alert.success(success.message);
        }
        if(error){
            alert.error(error);
        }

        setLoading(false);

        props.onHide();

        dispatch(props.ConfirmCancellationuserMode? myTasks(props.ConfirmCancellationtabDirection):myWorks(props.ConfirmCancellationtabDirection))

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
                {props.commence? 'Confirm Commencement':'Update Rate'}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>{props.commence? commenceMsg:updateRateMsg}</p>
            {!props.commence && !props.rate.finalRate&&
            <div>
                <h6>{`Current Rate: ${formatAmount(props.rate.value)}`}</h6>
                <div className="input">₦
                    <input 
                        type="text" 
                        name="rate"
                        autoComplete="off"
                        id="rate" 
                        placeholder="Enter new rate"
                        value={rate}
                        onChange={(e)=> setRate(formatNumber(e.target.value))}
                    />
                </div>
            </div>}
        </Modal.Body>
            <button 
                className={`btn bg-secondary-3 mx-3 mb-2 ${loading?'loading':''}`} 
                onClick={submitHandler}> {`${props.commence?'Proceed':'Update Rate'}`}
            </button>
        </Modal>
    );
}

const label = (status)=>{
    // 'Pending', 'Cancelled', 'Completed', 'Accepted','Abandoned'
    switch (status) {
        case 'Pending':
            return {
                i: 'fa fa-circle text-orange me-1',
                btn: 'btn bg-secondary-3',
                txt: {confirm: 'Accept Request', decline: 'Decline'},
                action: {confirm:'Accepted', decline: 'Declined'},
            }
        case 'Accepted':
            return {
                i: 'fa fa-circle text-orange me-1',
                btn: 'btn bg-secondary-3',
                txt: {confirm: 'Task Completed', decline: 'Abandon'},
                action: {confirm:'Completed', decline: 'Abandoned'},
            }
        case 'Completed':
            return {
                i: 'fa fa-circle text-success me-1',
                btn: 'btn bg-secondary-3',
                txt: `Task ${status}`,
                action: '',
            }
        default:
            return {
                i: 'fa fa-circle text-dark-3 me-1',
                btn: 'btn bg-dark-3',
                txt: `Task ${status}`,
                action: '',
        }
}
}

export default TaskRequestItemWorkerView;