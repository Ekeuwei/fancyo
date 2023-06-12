import React, { createContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { myTasks, myWorks } from '../../../actions/taskAction'
import TaskRequestItemUserView from './TaskRequestItemUserView'
import WorkRequestModel from '../../modal/WorkRequestModel';
import TaskRequestItemWorkerView from './TaskRequestItemWorkerView'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

export const ManageJobsContext = createContext();

const ManageJobs = () => {
    
    const userMode = JSON.parse(localStorage.getItem('userMode'));

    const dispatch = useDispatch();

    const history = useHistory();
    
    const defaultTab = {pending:false, 'in progress':false, completed:false}
    
    const [tabManagement, setTabManagement] = useState({...defaultTab, pending:true})
    const [tab, setTab] = useState('Pending');
    const [tabDirection, setTabDirection] = useState('pending')

    const tabClicked = e => {
        setTab(e.target.childNodes[0].textContent);
        setTabDirection(e.target.attributes['data-name'].value);
        requestTasks(e.target.attributes['data-name'].value);
        setTabManagement({...defaultTab, [e.target.childNodes[0].textContent.toLowerCase()]: true})
    }

    const requestTasks = status => dispatch(userMode? myTasks(status):myWorks(status));

    const { tasks, works, loading } = useSelector(state => state.myTasks);
    
    let size = works?.length || tasks?.length
    
    useEffect(()=>{
        dispatch(userMode? myTasks('Pending'):myWorks('Pending'))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [show, setShow] = useState(false);
    const handleClose = ()=> setShow(false);
    const showWorkRequestModal = ()=> setShow(true);

    return (
        <ManageJobsContext.Provider value={ {userMode, tabDirection}} >

            <div className="list--">
                <div className="d-flex">
                    <h3 className='list--title' onClick={()=>history.push('/managetasks')}>Manage Tasks</h3>
                    {userMode&&<button className='btn' onClick={showWorkRequestModal}>
                    <i className="fa fa-plus me-1" aria-hidden="true"></i>
                    create request</button>}
                </div>
                <div className="list--heading">
                    <div className={`job-status ${tabManagement.pending && 'active'}`} data-name="pending" onClick={tabClicked}>
                        Pending
                        <span className={`job-status ${size>0&&'bordered-icon'} ${!tabManagement.pending && 'd-none'}`}>{size>0?size:''}</span>
                    </div>
                    <div className={`job-status ${tabManagement['in progress'] && 'active'}`} data-name="accepted" onClick={tabClicked}>
                        In progress
                        <span className={`job-status ${size>0&&'bordered-icon'} ${!tabManagement['in progress'] && 'd-none'}`}>{size>0?size:''}</span>
                    </div>
                    <div className={`job-status ${tabManagement.completed && 'active'}`} data-name="completed" onClick={tabClicked}>
                        Completed
                        <span className={`job-status ${size>0&&'bordered-icon'} ${!tabManagement.completed && 'd-none'}`}>{size>0?size:''}</span>
                    </div>
                </div>
                
                {(size>0)?<>
                    {tasks&& tasks.map(task => <TaskRequestItemUserView key={task._id} task={task} userMode={userMode} tabDirection={tabDirection}/>)}
                    {works&& works.map(work => <TaskRequestItemWorkerView key={work._id} task={work} userMode={userMode} tabDirection={tabDirection} />)}
                </>:
                <div className={`empty-task-list ${loading&& 'loading'}`}>
                    <h5>{`No Task ${tab}`}</h5>
                </div>}

                <WorkRequestModel show={show} handleClose={handleClose}/>
            </div>

        </ManageJobsContext.Provider>
    )
}

export default ManageJobs