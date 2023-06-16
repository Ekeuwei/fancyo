import { formatTime } from "../../Utils";
import UpdateButton from "../../layout/UpdateButton";



const TaskRequestItemWorkerView = ({task, userMode, tabDirection})=>{
    const view = label(task.escrow.worker);
    const taskConcluded = task.escrow.user === "Cancelled"||
                          "Completed, Declined".includes(task.escrow.worker);
    const pendingConfirmation = task.escrow.user!=="Completed" && task.escrow.worker === "Completed"
    const details = {
        taskId: task._id,
        workerId: task.user._id,
        status: view.action
    }

    const commission = task.budget * 0.1 || task.worker.pricing.minRate * 0.1;
    
    return (
        <div className="jobrequest-item">
            <div className="avatar">
                <img src="/images/avatar.png" alt="" />
            </div>
            <div className="jobrequest--content">
                <div className="title-containter">
                    <h5 className='single-line'>{task.title}</h5>
                    <p>{formatTime(task.createdAt)}</p>
                </div>
                <p className='message'>{task.summary||task.description}</p>
                {taskConcluded ? 
                (<em><h6 className='single-line mb-0'>
                    <i className={view.i} aria-hidden="true" style={{fontSize: "10px"}}></i>
                        {pendingConfirmation?"Pending confirmation":view.txt}</h6></em>):
                <h5>
                    <i className="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
                    {task.location?.town}
                </h5>}
                <div className={`jobrequest--action ${taskConcluded? 'd-none':''}`}>
                    <UpdateButton updateDetails={{...details, status:view.action.confirm}} view={{ txt:view.txt.confirm, btn:view.btn }} commission={commission} userMode={userMode} tabDirection={tabDirection} />
                    <UpdateButton updateDetails={{...details, status:view.action.decline}} view={{ txt:view.txt.decline, btn:'btn decline' }} commission={commission} userMode={userMode} tabDirection={tabDirection} />
                </div>
            </div>
        </div>
)}


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
                btn: 'btn ms-auto bg-dark-3',
                txt: `Task ${status}`,
                action: '',
        }
}
}

export default TaskRequestItemWorkerView;