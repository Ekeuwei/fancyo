import React, { Fragment, useEffect } from 'react'
import { Tabs } from './AccountProfile'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from 'react-redux';
import { loadUserWorkers } from '../../actions/workerActions';

const AccountWorker = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { workers, loading, error } = useSelector(state => state.userWorkers);
  useEffect(()=>{
    dispatch(loadUserWorkers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Fragment>
      <div className="account-breadcrumbs">
            <img className="rounded-circle me-2" src="/images/avatar.png" style={{height: "3em"}} alt="" />
            <div className="breadcrumbs-title">
                <span><strong>Alfred Ekeuwei</strong> / <strong>Edit Profile</strong></span>
                <p className='mb-0'>Setup your presence and hiring needs</p>
            </div>
        </div>
        <Tabs history={history} />
        {!loading&& <div className="">
          {workers.length ===0 ? <div className="no-work-profile">
            <p>{`${error || 'You have no work profile'}`}</p>
            <button className='btn btn-secondary' onClick={()=>history.push('/account/worker/create')} >
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              create work profile</button>
          </div> :
          <div className="work-profile-list">
            {workers.map(worker=>( <WorkerPreview worker={worker}/> ))}
            <button className='btn btn-secondary m-4' onClick={()=>history.push('/account/worker/create')}>
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              Add another profile</button>
          </div>}
        </div>}
    </Fragment>
  )
}

const WorkerPreview = ({worker})=> {

  return (
    <div className="work-profile-list-item">
      {/* <img src="/images/featured.png" alt="" /> */}
      <span>
        <h5>{worker?.category?.name}</h5>
      </span>
      <p className='m-0'>
        {worker.description || `Hi there, I’m 16 years old. I run errands and 
        dispatch and I do it with pleasure. I’m very much 
        familiar with the nooks... More`}
      </p>
    </div>
  )
}

export default AccountWorker