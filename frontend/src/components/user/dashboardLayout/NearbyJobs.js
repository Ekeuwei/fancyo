import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getNearbyTasks } from '../../../actions/taskAction';
import NearbyTaskItemView from './NearbyTaskItemView';
import { getCategories, getLgas, getStates, getTowns } from '../../../actions/prefsAction';
import SearchDropdown from '../../layout/SearchDropdown';
import { MultipleInput } from '../AccountCreateWorker';

const NearbyJobs = () => {

    const dispatch = useDispatch();

    const { loading, nearbyTasks } = useSelector(state => state.myTasks);

    const { user } = useSelector(state => state.auth);

    const handleFilter = data => {
        dispatch(getNearbyTasks(data));
        handleClose();
    }

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    useEffect(()=>{
        dispatch(getNearbyTasks({location: {lga:user?.contact?.town?.lga?._id}}))
    }, [dispatch, user.contact]);

    return (
        // loading?<Loader/>:
        (<div className={`nearby-tasks ${loading&& 'loading'}`}>
            <div className="heading-link">
                <div className="title">
                    <h5>Job Requests Near You</h5>
                </div>
                <div className="link" onClick={handleOpen}>
                    <h5>
                        <i className="fa fa-filter me-1" aria-hidden="true"></i>
                        Filter
                    </h5>
                </div>
            </div>
            {(nearbyTasks?.length>0?
                <div className="list--">
                    {nearbyTasks.map(task => (
                        <NearbyTaskItemView key={task._id} task={task}/>
                    ))}
                </div> :
                <div className={`empty-task-list`}>
                    <h5>{`No Task`}</h5>
                </div>
            )}
            {isOpen&& <FilterModal handleFilter={handleFilter} loading={loading} handleClose={handleClose}/>}
        </div>)
    )
}

const FilterModal = ({handleFilter, loading, handleClose})=>{

    const dispatch = useDispatch();

    const { categories, states, lgas, towns } = useSelector(state => state.prefs)

    const [suggestions, setSuggestions] = useState(categories);

    const [myCategories, setMyCategories] = useState([])

    const [location, setLocation] = useState({
        state: {name:''},
        lga: {name:''},
        town: {name:''}
    });

    const onChange = (value, name) => setLocation(prev => ({...prev, [name]:value}))

    const filter = ()=> {

        handleFilter({
            categories, 
            location:{
                state: location.state._id,
                lga: location.lga._id,
                name: location.town.name
            }
        })

    }
    useEffect(()=>{
        dispatch(getStates());
        dispatch(getCategories())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setSuggestions(categories);
    }, [categories]);

    useEffect(()=>{
        if(location?.state?._id){
            dispatch(getLgas(location?.state?._id))
        }
        setLocation(prev => ({...prev, lga:{name:''}, town:{name:''}}))
    }, [dispatch,location?.state?._id])

    useEffect(()=>{
        if(location.lga._id){
            dispatch(getTowns(location?.lga?._id))
        }
        setLocation(prev => ({...prev, town:{name:''}}))
    }, [dispatch, location.lga?._id])

  return (
    <div className="modal--overlay">
        <div className="modal-">
            <div className="filter">
                <div className="mb-3">
                    <h5>Category</h5>
                    <MultipleInput 
                        suggestions={suggestions} 
                        setSuggestions={setSuggestions}
                        myChoices={myCategories}
                        setMychoices={setMyCategories}
                        suggestionTitle={'Categories'}
                        validateField={true} />
                </div>

                <div className="mb-3">
                    <h5>Location</h5>
                    <div className="input mb-2">
                        <SearchDropdown 
                            validateField={true} 
                            value={location.state} 
                            name={'state'} 
                            itemSelected = { onChange }
                            onChange={onChange} 
                            suggestions={states} 
                            placeholder='State' />
                    </div>
                    <div className="input mb-2">
                        <SearchDropdown 
                            validateField={true} 
                            value={location.lga} 
                            name={'lga'} 
                            itemSelected = { onChange }
                            onChange={onChange} 
                            suggestions={lgas} 
                            placeholder='LGA' />
                    </div>
                    <div className="input mb-2">
                        <SearchDropdown 
                            validateField={true} 
                            value={location.town} 
                            name={'town'} 
                            itemSelected = { onChange }
                            onChange={onChange} 
                            suggestions={towns} 
                            placeholder='Town' />
                    </div>
                    
                </div>
                <div className="d-flex">
                    <button className="btn me-1 bg-dark-3" onClick={handleClose}>Cancel</button>
                    <button className={`btn bg-primary-1 ${loading?'loading':''}`} onClick={filter}>Apply filter</button>
                </div>
            </div>
        </div>
    </div>
  );

}


export default NearbyJobs