import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchDropdown from "../layout/SearchDropdown";
import { getLgas, getStates, getTowns } from "../../actions/prefsAction";

const LocationPicker = ({handleFilter, loading, handleClose})=>{

    const dispatch = useDispatch();

    const { states, lgas, towns } = useSelector(state => state.prefs)


    const lastLocation = JSON.parse(localStorage.getItem("location"))??{state:{name:""},lga:{name:""},town:{name:""}}

    const [location, setLocation] = useState({
        state: lastLocation.state,
        lga: lastLocation.lga,
        town: lastLocation.town
    });

    const onChange = (value, name) => setLocation(prev => ({...prev, [name]:value}))

    const filter = ()=> {

        handleFilter(location)

    }
    useEffect(()=>{
        dispatch(getStates());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                    <button className={`btn bg-primary-1 ${loading?'loading':''}`} onClick={filter}>Apply settings</button>
                </div>
            </div>
        </div>
    </div>
  );

}

export default LocationPicker
