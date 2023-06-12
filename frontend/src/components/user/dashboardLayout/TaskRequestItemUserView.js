import UpdateButton from "../../layout/UpdateButton";
import { formatTime } from "../../Utils";

const TaskRequestItemUserView = ({task, action, userMode, tabDirection})=>{
    const view = label(task.status);
    const displayButton = worker => worker.escrow.user === "Completed"? "Review":view.txt
    const handleUpdate = (details) => action(details);
    const updateDetails = {
        taskId: task._id,
        workerId: task.workers.length>0? task.workers[0]._id : '',
        status: view.action
    }
    
    return (
        <>
            {task.workers.length>1?
            (<>
                <div className='jobrequest-item timeline'>
                    <div className="jobrequest--content">
                        <div className="title-containter">
                            <h5 className='single-line'>{task.title}</h5>
                            <p>5 mins</p>
                        </div>
                        <p className='message'>{task.description}</p>
                        <div className="jobrequest--action">
                            <i className={view.i} aria-hidden="true" style={{"font-size": "10px"}}></i>
                            <em><h6 className='single-line mb-0'>{view.status}</h6></em>
                            <button className={`${view.btn} hide`} onClick={()=>handleUpdate(updateDetails)}>{view.txt}</button>
                        </div>
                    </div>
                </div>
                <div className="timeline-list">
                    {task.workers.map(taskWorker => 
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

    return(
        <div className="timeline-item">
            <div className="jobrequest-item timeline-bullet">
                <div className="avatar" style={{maxWidth: '50px', paddingBottom: '50px'}}>
                    <img src={taskWorker.worker.owner.avatar.url} alt={taskWorker.worker.owner.firstName} />
                </div>
                <div className="jobrequest--content">
                    <div className="title-containter">
                        <h5 className='single-line'>{`${taskWorker.worker.owner.firstName} ${taskWorker.worker.owner.lastName}`}</h5>
                        <p></p>
                    </div>
                    <div className="jobrequest--action">
                        <i className={view.i} aria-hidden="true" style={{"font-size": "10px"}}></i>
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
const SingleWorker = ({singleWorker, taskId, description, displayButton, time, userMode, tabDirection, review})=>{
    const view = label(singleWorker.escrow.worker)
    const details = {
        taskId,
        workerId: singleWorker._id,
        status: view.action
    }

    // const { userMode, tabDirection } = useContext(ManageJobsContext)

    return(
        <div className="jobrequest-item">
            <div className="avatar">
                <img src="/images/avatar.png" alt="" />
            </div>
            <div className="jobrequest--content">
                <div className="title-containter">
                    <h5 className='single-line'>{`${singleWorker.worker.owner.firstName} ${singleWorker.worker.owner.lastName}`}</h5>
                    <p>{formatTime(time)}</p>
                </div>
                <p className='message'>{description}</p>
                <div className="jobrequest--action">
                    <i className={view.i} aria-hidden="true" style={{"font-size": "10px"}}></i>
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