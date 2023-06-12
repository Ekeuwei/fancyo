import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { myTasks, myWorks } from '../../../actions/taskAction';
import TaskRequestItemUserView from './TaskRequestItemUserView';
import TaskRequestItemWorkerView from './TaskRequestItemWorkerView';

const AllTasksAndWorks = () => {

    const dispatch = useDispatch();

    const userMode = JSON.parse(localStorage.getItem('userMode'));

    const { loading, tasks, works } = useSelector(state => state.myTasks);

    const handleFilter = data => {
        dispatch(userMode? myTasks(""):myWorks(""));
        handleClose();
    }

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    useEffect(()=>{
        dispatch(userMode? myTasks(''):myWorks(''))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const size = tasks?.length > 0 || works?.length > 0;

    const tabDirection = "";

    return (
        // loading?<Loader/>:
        (<div className={`nearby-tasks ${loading&& 'loading'}`}>
            <div className="heading-link">
                <div className="title">
                    <h5>My Tasks</h5>
                </div>
                <div className="link" onClick={handleOpen}>
                    <h5>
                        <i className="fa fa-filter me-1" aria-hidden="true"></i>
                        Filter
                    </h5>
                </div>
            </div>
            {(size>0)?
                (<>
                    {tasks&& tasks.map(task => <TaskRequestItemUserView key={task._id} task={task} userMode={userMode} tabDirection={tabDirection} />)}
                    {works&& works.map(work => <TaskRequestItemWorkerView key={work._id} task={work} userMode={userMode} tabDirection={tabDirection} />)}
                </>):
                <div className={`empty-task-list ${loading&& 'loading'}`}>
                    <h5>{`No Task`}</h5>
                </div>
            }
            {isOpen&& <FilterModal handleFilter={handleFilter} loading={loading} handleClose={handleClose}/>}
        </div>)
    )
}

const FilterModal = ({handleFilter, loading, handleClose})=>{

    const status = [
        'Pending',
        'Completed',
        'In-progress',
    ];

    const [filter, setFilter] = useState({
        status: '',
        from: '',
        to: '',
    });
    const onChange = e => setFilter(prev => ({...prev, [e.target.name]:e.target.value}))

  return (
    <div className="modal--overlay">
        <div className="modal-">
            <div className="filter">

                <div className="mb-3">

                    <div className="mb-2">
                        <h5>From</h5>
                        <input 
                            aria-label="from" 
                            name="from"
                            className='input'
                            type='date'
                            value={filter.from}
                            onChange={onChange}>
                        </input>
                    </div>
                    <div className="mb-2">
                        <h5>to</h5>
                        <input 
                            aria-label="to" 
                            name="to"
                            type='date'
                            className='input'
                            value={filter.to}
                            onChange={onChange}>
                        </input>
                    </div>
                </div>

                <div className="my-3">
                    <h5>Status</h5>
                    <div className="input">
                        <select 
                            aria-label="Select state" 
                            name="state"
                            value={filter.state}
                            onChange={onChange}>
                            {status.map(value => <option key={value} value={value}>{value}</option>)}
                        </select>
                    </div>
                </div>

                <div className="d-flex">
                    <button className="btn me-1 bg-dark-3" onClick={handleClose}>Cancel</button>
                    <button className={`btn bg-primary-1 ${loading?'loading':''}`} onClick={handleFilter}>Apply filter</button>
                </div>
            </div>
        </div>
    </div>
  );

}


export default AllTasksAndWorks