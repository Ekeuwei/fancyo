import React, { Fragment, useEffect } from 'react'
import { SectionBreadcrumbs, Tabs } from './AccountProfile'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from 'react-redux';
import { loadUserWorkers } from '../../actions/workerActions';
import Loader from '../layout/Loader';
import { useAlert } from 'react-alert';

const AccountWorker = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();
  const { workers, loading, error } = useSelector(state => state.userWorkers);
  useEffect(()=>{
    dispatch(loadUserWorkers())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const user = JSON.parse(localStorage.getItem("user"))
  const handleCreateWorker = ()=>{
    if(user?.contact){
      history.push('/account/worker/create')
    }else{
      history.push('/account/contact');
      alert.info("Update your contact before proceeding")
    }
  }
  return (
    <Fragment>
        <SectionBreadcrumbs section={{title:'Worker Profile', subTitle: 'Setup your presence and hiring needs'}}/>
        <Tabs history={history} />
        {loading? <Loader /> : <>
          {workers.length ===0 ? <div className="no-work-profile">
            <p>{`${error || 'You have no work profile'}`}</p>
            <button className='btn btn-secondary' onClick={handleCreateWorker} >
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              create work profile</button>
          </div> :
          <div className="work-profile-list">
            {workers.map(worker=>( <WorkerPreview worker={worker}/> ))}
            <button className='btn btn-secondary m-4' onClick={handleCreateWorker}>
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              Add another profile</button>
          </div>}
        </>}
    </Fragment>
  )
}

const WorkerPreview = ({worker})=> {

  return (
    <div className="work-profile-list-item">
      <span>
        <h5>{worker?.category?.name}</h5>
      </span>
      <p className='m-0'>
        {worker.description}
      </p>
    </div>
  )
}

export default AccountWorker