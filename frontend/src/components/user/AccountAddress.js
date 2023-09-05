import React, { Fragment, useState, useEffect } from 'react'
import { SectionBreadcrumbs, Tabs } from './AccountProfile';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useAlert } from 'react-alert';
import { useSelector, useDispatch } from 'react-redux';
import { clearErrors, loadUser, updateProfile } from '../../actions/userActions';
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants';
import { getLgas, getStates, getTowns } from '../../actions/prefsAction';
import SearchDropdown from '../layout/SearchDropdown';

const AccountAddress = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const alert = useAlert();
    const {error, loading, isUpdated } = useSelector(state => state.user);
    const { states, lgas, towns } = useSelector(state => state.prefs);
    
    const currentUser = JSON.parse(localStorage.getItem('user'))

    const [contact, setContact] = useState({
        state: {...currentUser?.contact?.town?.state},
        lga: {...currentUser?.contact?.town?.lga},
        town: {...currentUser?.contact?.town},
        address: {name: currentUser?.contact?.address}
    })

    const onChange = (value, field) => setContact(prev => ({...prev, [field]: value}))
    
    const itemSelected = (value, field) => setContact(prev => ({...prev, [field]: value}))
    
    const submitHandler = (e)=>{
        e.preventDefault();
        
        const payload = {
            address: contact.address?.name||contact.address,
            town: contact.town.name,
            lga: contact.lga._id,
            state: contact.state._id,
        }

        
        const valid = Object.values(payload).every(entry => entry!=='' && entry!==undefined)
        
        if(valid ){

            const formData = new FormData();
            formData.set('data', JSON.stringify({contact: payload}));
            dispatch(updateProfile(formData));
            
        }else{
            
            return alert.error('All fields must be filled')
            
        }

        
    }


    useEffect(()=>{
        if(error){
            dispatch(clearErrors())
            alert.error(error)
        }

        if(isUpdated){
            alert.success("Updated Successfully");
            dispatch({type: UPDATE_PROFILE_RESET});
            dispatch(loadUser());
        }

    }, [dispatch, alert,isUpdated, error]);

    useEffect(()=>{
        dispatch(getStates())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=>{
        if(contact.state._id){
            dispatch(getLgas(contact.state._id))
        }
    }, [dispatch, contact.state._id])

    useEffect(()=>{
        if(contact.lga._id){
            dispatch(getTowns(contact.lga._id))
        }
    }, [dispatch, contact.lga._id])

  return (
    <Fragment>
        <SectionBreadcrumbs section={{title:'Contact', subTitle: 'Setup your contact address'}}/>
        <Tabs history={history} />
        <form className='mx-3' onSubmit={submitHandler}>
            <div className={`input mb-3 ${!contact.state.name ?'shake':''}`}>
                <SearchDropdown 
                    validateField={true} 
                    value={contact.state} 
                    name={'state'} 
                    itemSelected = { itemSelected }
                    onChange={onChange} 
                    suggestions={states} 
                    placeholder='State' />
            </div>
            <div className={`input mb-3 ${!contact.lga.name ?'shake':''}`}>
                <SearchDropdown 
                    validateField={true} 
                    value={contact.lga} 
                    name={'lga'} 
                    itemSelected = { itemSelected }
                    onChange={onChange} 
                    suggestions={lgas} 
                    placeholder='Lga' />
            </div>
            <div className={`input mb-3`}>
                <SearchDropdown 
                    value={contact.town} 
                    name={'town'}
                    itemSelected = { itemSelected }
                    onChange={onChange} 
                    suggestions={towns} 
                    placeholder='Name of Town' />
            </div>
            
            <div className="mb-3">
                <textarea 
                    name="address" 
                    className='input'
                    id="address"
                    value={contact.address.name}
                    placeholder='Closest landmark'
                    onChange={e => onChange(e.target.value, e.target.name)}
                />
            </div>
            <div className="mb-3 text-center">
                <button disabled={loading} type="submit" className={`btn bg-primary-1 px-3`}>Save</button>
            </div>
        </form>
    </Fragment>

  )
}

export default AccountAddress