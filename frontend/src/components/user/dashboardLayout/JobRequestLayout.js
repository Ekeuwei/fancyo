import React from 'react'

const t = {
    title: 'TV Installation',
    description: `I want someone to sweep my office twice a week. 
                    I want someone to sweep my office twice a week`,
    location: 'Edepie, Yenagoa',
    budget: '500'
}

const JobRequestItem = ({task, accept, decline})=>(
    <div className="jobrequest-item">
        <div className="avatar">
            <img src="/images/avatar.png" alt="" />
        </div>
        <div className="jobrequest--content">
            <div className="title-containter">
                <h5 className='single-line'>{task.title}</h5>
                <p>5 mins</p>
            </div>
            <p className='message'>{task.description}</p>
            <h5>
                <i class="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
                {task.location}
            </h5>
            <div className="jobrequest--action">
                <button className={accept? 'btn bg-secondary-3':task.budget?'btn budget':'d-none'} onClick={accept}>{accept?'Accept request':task.budget&&`Budget: ₦${task.budget}`}</button>
                <button className={decline?'btn decline':'btn bg-secondary-3'} onClick={decline}>{decline?'Decline':`I'm interested`}</button>
            </div>
        </div>
    </div>
)

export const JobRequestLayoutUser = ({task, accept, decline})=>(
    <div className="jobrequest-item">
        <div className="avatar">
            <img src="/images/avatar.png" alt="" />
        </div>
        <div className="jobrequest--content">
            <div className="title-containter">
                <h5 className='single-line'>{task.title}</h5>
                <p>5 mins</p>
            </div>
            <p className='message'>{task.description}</p>
            <h5>
                <i class="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
                {task.location}
            </h5>
            <div className="jobrequest--action">
                <div className={accept? 'btn':'btn budget'} onClick={accept}>{accept?'Accept request':`Budget: ₦${task.budget}`}</div>
                <button className={decline?'btn decline':'btn'} onClick={decline}>{decline?'Decline':`I'm interested`}</button>
            </div>
        </div>
    </div>
)

export const TaskItemUserView = ({task, accept, decline})=>(
    <div className="jobrequest-item">
        <div className="avatar">
            <img src="/images/avatar.png" alt="" />
        </div>
        <div className="jobrequest--content">
            <div className="title-containter">
                <h5 className='single-line'>{task.title}</h5>
                <p>5 mins</p>
            </div>
            <p className='message'>{task.description}</p>
            <div className="jobrequest--action">
                <h5>
                    <i class="fa fa-map-marker me-1 text-danger" aria-hidden="true"></i>
                    {task.location}
                </h5>
                <button className='btn decline' onClick={decline}>{decline?'Decline':`I'm interested`}</button>
            </div>
        </div>
    </div>
)

JobRequestItem.defaultProps = {
    task: t
}

export default JobRequestItem