import React, { useState } from 'react'
import TaskApplicationModal from '../../modal/TaskApplicationModal'
import { formatAmount, formatTime } from '../../Utils';

const NearbyTaskItemView = ({task}) => {
    
    const user = JSON.parse(localStorage.getItem("user"));
    
    const [show, setShow] = useState(false)
    const handleClose = ()=> setShow(false);
    const openModal = ()=> setShow(true);
    
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
            <h5>
                <i className="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
                {task.location.town}
            </h5>
            <div className="jobrequest--action">
                {task.budget&&<div className={'btn budget'} >{`Budget: ${formatAmount(task.budget)}`}</div>}
                <button className={'btn accept'} onClick={openModal}>Apply</button>
            </div>
        </div>
        {user?.workers&& <TaskApplicationModal workerProfiles={user?.workers} taskId={task._id} show={show} handleClose={handleClose}/>}
    </div>
  )
}

export default NearbyTaskItemView