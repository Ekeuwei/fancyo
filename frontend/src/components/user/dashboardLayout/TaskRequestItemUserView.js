import { useState } from "react";
import UpdateButton from "../../layout/UpdateButton";
import { formatTime } from "../../Utils";

const TaskRequestItemUserView = ({task, action, userMode, tabDirection})=>{
    const view = label(task.status);
    const displayButton = worker => worker.escrow.user === "Completed"? "Review":view.txt
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
                        time={task.createdAt} 
                        userMode={userMode} 
                        tabDirection={tabDirection} 
                        review={taskWorker.review} />))}
                    
                    {task.applicants?.map(taskApplicant => 
                    (<Applicant 
                        key={taskApplicant._id} 
                        taskApplicant={taskApplicant} 
                        taskId={task._id} 
                        displayButton={displayButton} 
                        handleUpdate={handleUpdate} 
                        time={task.createdAt} 
                        userMode={userMode} 
                        tabDirection={tabDirection} 
                        review={taskApplicant.review} />))}
                </div>
            </>):
            (task.workers.length===1 && 
                <SingleWorker 
                    singleWorker={task.workers[0]} 
                    taskId={task._id} 
                    displayButton={displayButton} 
                    description={task.description} 
                    handleUpdate={handleUpdate} 
                    time={task.createdAt} 
                    userMode={userMode} 
                    tabDirection={tabDirection}
                    review={task.workers[0].review} />)}
        </>
)}


const GroupWorkers = ({taskWorker, taskId, displayButton, time, userMode, tabDirection, review})=>{
    const view = label(taskWorker.escrow.worker)
    const details = {
        taskId,
        workerId: taskWorker._id,
        status: view.action
    }

    // const { userMode, tabDirection } = useContext(ManageJobsContext)
    const [showImage, setShowImage] = useState(true)

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
                        <h5 className='single-line'>{`${taskWorker.worker.owner.firstName} ${taskWorker.worker.owner.lastName}`}</h5>
                        <p></p>
                    </div>
                    <div className="jobrequest--action">
                        <i className={view.i} aria-hidden="true" style={{fontSize: "10px"}}></i>
                        <em><h6 className='single-line mb-0'>{view.status}</h6></em>
                        <UpdateButton 
                            updateDetails={details} 
                            view={{...view, txt:`${displayButton(taskWorker)}` }} 
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

const Applicant = ({taskApplicant, taskId, displayButton, time, userMode, tabDirection, review})=>{
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
const SingleWorker = ({singleWorker, taskId, description, displayButton, time, userMode, tabDirection, review})=>{
    const view = label(singleWorker.escrow.worker)
    const details = {
        taskId,
        workerId: singleWorker._id,
        status: view.action
    }

    const [showImage, setShowImage] = useState(true)
    // const { userMode, tabDirection } = useContext(ManageJobsContext)

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
                    <h5 className='single-line'>{`${singleWorker.worker.owner.firstName} ${singleWorker.worker.owner.lastName}`}</h5>
                    <p>{formatTime(time)}</p>
                </div>
                <p className='message'>{description}</p>
                <div className="jobrequest--action">
                    <i className={view.i} aria-hidden="true" style={{fontSize: "10px"}}></i>
                    <em><h6 className='single-line mb-0'>{view.status}</h6></em>
                    <UpdateButton 
                        updateDetails={details} 
                        view={{...view, txt:`${displayButton(singleWorker)}`}} 
                        userMode={userMode} 
                        tabDirection={tabDirection} 
                        workerId={singleWorker.worker._id} 
                        taskWorker={singleWorker} />
                </div>
            </div>
        </div>
    )
}

const label = (status)=>{
    // 'Pending', 'Cancelled', 'Completed', 'In Progress','Abandoned'
    switch (status) {
        case 'Accepted':
            return {
                i: 'fa fa-circle text-orange me-1',
                btn: 'bg-dark-3 btn ms-auto',
                txt: 'Cancel',
                status: 'In Progress',
                action: ''
            }
        case 'Pending':
            return {
                i: 'fa fa-circle text-dark-3 me-1',
                btn: 'bg-dark-3 btn ms-auto',
                txt: 'Cancel',
                status,
                action: ''
            }
        case 'Completed':
            return {
                i: 'fa fa-circle text-success me-1',
                btn: 'btn ms-auto bg-secondary-3',
                txt: 'Confirm',
                status,
                action: 'Completed'
            }
        case 'Request':
            return {
                i: 'fa fa-circle text-success me-1',
                btn: 'btn ms-auto bg-secondary-3',
                txt: 'Assign Task',
                status,
                action: 'Assigned'
            }
    
        default:
            return {
                i: 'fa fa-circle text-dark-3 me-1',
                btn: 'btn ms-auto bg-dark-3 d-none',
                txt: 'Cancel',
                status: `${status} by worker`,
                action: 'Cancelled'
            }
    }
}

export default TaskRequestItemUserView;