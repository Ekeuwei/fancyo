import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { clearErrors, createWorker } from '../../actions/workerActions';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { CREATE_WORKER_RESET } from '../../constants/workerConstants';
import { getTowns } from '../../actions/prefsAction';
import SearchDropdown from '../layout/SearchDropdown';

const AccounCreatetWorker = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const alert = useAlert();

  const featureInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  const [hasFG, setHasFG] = useState(false);
  
  const { error, loading, success } = useSelector(state => state.worker);
  const { towns } = useSelector(state => state.prefs);

  const user = JSON.parse(localStorage.getItem("user"));

  // const [images, setImages] = useState({
  //   avatar: user?.avatar?.url || `${window.location.origin}/images/default_avatar.png`,
  //   featured: ''
  // });

  const [worker, setWorker] = useState({
        avatar: user?.avatar?.url,
        featuredGraphics: '',
        // category: {name: '', sn: ''},
        minRate: '',
        dailyRate: '',
        description: '',
    })
  const [shakeFields, setShakeFields] = useState([]);

    const onChange = e => {
      setShakeFields([])
      if('avatar, featuredGraphics'.includes(e.target.name)){
        const reader = new FileReader();

        reader.onload = () => {
            if(reader.readyState === 2){
              setWorker(prevData => ({...prevData, [e.target.name]: reader.result}));
            }
        }

        reader.readAsDataURL(e.target.files[0])
      } else if("minRate, dailyRate".includes(e.target.name)){
        setWorker({ ...worker, [e.target.name]: formatNumber(e.target.value) })
      }else{
        setWorker({ ...worker, [e.target.name]: e.target.value })
      }
    }

    const formatNumber = (number) =>{
        const value = number.replace(/\D/g, '');
        return  new Intl.NumberFormat('en-US').format(value);
    }
    
    const submitHandler = (e)=>{
      e.preventDefault();

      const emptyFields = Object.keys(worker).filter(key => worker[key]==="");
      setShakeFields(emptyFields);

      if(emptyFields.length === 0){
        dispatch(createWorker({...worker, localities}))
      }
    }

    // const categories = [
    //     {key: 'makeup', name:"Make-up Artist"}, 
    //     {key: "carpenter", name: "Carpenter"}, 
    //     {key: "electrician", name: "Electrician"}, 
    //     {key: "mc", name: "MC (Master of Ceremony)"}, 
    //     {key: "housekeep", name: "House Keeper"},
    //     {key: "nanny", name: "Nanny"}
    // ];

    useEffect(()=>setHasFG(worker.featuredGraphics), [worker.featuredGraphics]);
    
    useEffect(()=>dispatch(getTowns(user.contact.town._id)), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    
    
    // eslint-disable-next-line no-unused-vars
    const [ suggestions, setSuggestions ] = useState(towns)
    // eslint-disable-next-line no-unused-vars
    const [localities, setLocalities] = useState([])

    useEffect(()=>{
      if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(success){
            alert.success("Account created!")
            dispatch({type: CREATE_WORKER_RESET})
            history.goBack();
        }

        if(towns){
          setSuggestions(towns)
        }
    }, [error, success, dispatch, alert, history, towns])

  return (
    <Fragment>
      <form onSubmit={submitHandler}>
        <div className="featured-graphics">
          <div className={`featured-graphics-button ${hasFG && 'd-none'}`}>
            <input className='d-none' type='file' ref={featureInputRef} name="featuredGraphics" onChange={onChange}/>
            <button className={`btn btn-secondary ${shakeFields.includes('featuredGraphics')? 'shake':''}`} onClick={()=> featureInputRef.current.click()}>
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              Add Display Picture
            </button>
            {shakeFields.includes('featuredGraphics')&&<div className='input-warning'>upload feature graphics</div>}
          </div>
          <img 
              src={worker.featuredGraphics} 
              className={`${!hasFG && 'd-none'}`}
              alt="featured Graphics"
            />
          <div className={`clear-btn ${!hasFG && 'd-none'}`} onClick={()=>setWorker(prevData=>({...prevData, featuredGraphics:''}))}>
            <i className="fa fa-minus-circle p-2" aria-hidden="true"></i>
          </div>
        </div>
        <div className="featured-graphics-avatar">
            <input className='d-none' name='avatar' ref={avatarInputRef} type="file" onChange={onChange} />
            <img 
                src={worker.avatar || `${window.location.origin}/images/default_avatar.png`}
                name="avatar"
                onChange={onChange}
                alt=""
              />
            <i className="fa fa-pencil-square-o edit-icon" onClick={()=>avatarInputRef.current.click()} aria-hidden="true"></i>
        </div>

        <div className="mx-3 mt-4">
          {/* <div className="mb-3">
            <label for="category" className="form-label">Category / Service Type </label>
            <select 
                className={`form-select ${shakeFields.includes('category')? 'shake':''}`} 
                aria-label="Select category"
                name="category"
                value={worker.category}
                onChange={onChange} >
                <option selected>select</option>
                {categories.map(category => <option key={category.key} value={category.key}>{category.name}</option>)}
            </select>
          </div> */}

          <div className="mb-3">
            <label for="description" className="form-label">Service:</label>
            <textarea 
                type="text" 
                name="description" 
                className={`input ${shakeFields.includes('description')? 'shake':''}`} 
                id="description"
                placeholder='Tell us what you do'
                rows={1}
                value={worker.description}
                onChange={onChange}
            />
          </div>

          <div className="mb-3">
            <label for="minRate" className="form-label">Minimum charge:</label>
            <input 
                name="minRate"
                type="text" 
                className={`input ${shakeFields.includes('minRate')? 'shake':''}`} 
                id="minRate" 
                placeholder='Least amount you charge per job'
                value={worker.minRate}
                onChange={onChange}
            />
          </div>
          <div className='mb-3'>
              <label for="dailyRate" className="form-label">Daily rate:</label>
              <input 
                  name="dailyRate"
                  type="text" 
                  className={`input ${shakeFields.includes('dailyRate')? 'shake':''}`} 
                  id="dailyRate" 
                  placeholder="How much do you charge for a full day's job"
                  value={worker.dailyRate}
                  onChange={onChange}
              />
          </div>

          {/* <MultipleInput 
            suggestions={suggestions} 
            setSuggestions={setSuggestions}
            myChoices={localities}
            setMychoices={setLocalities}
            suggestionTitle="Localities" /> */}

        </div>
        <div className={`mb-3 text-center`}>
            <button disabled={loading} type="submit" className={`btn bg-primary-1 px-3 ${loading?'loading':''}`}>Create Account</button>
        </div>
      </form>
    </Fragment>
  )
}

export const MultipleInput = ({suggestions, setSuggestions, myChoices, setMychoices, suggestionTitle, validateField})=>{
  
  const [textInput, setTextInput] = useState({name:''});

  const onChange = (value, name) => setTextInput(value)
 

  const itemSelected = (value, name) => {
    addItem(value)
    setTextInput({name:''})
  }
  

  const addItem = (item) => {

        let validItem = item.name;

        if(validateField){
          
          const validValue = suggestions.find(s => s.name.toLowerCase()===item.name.toLowerCase())
          
          validItem = typeof validValue === 'object' && validValue !== null
          
        }
    
        if(validItem){

          setMychoices(prev => [...prev, item]);
  
          setSuggestions(prev=> prev.filter(e => e.name?.toLowerCase()!== item.name?.toLowerCase()));
        }
    };

    const removeItem = (item) => {
        const updatedValueList = myChoices.filter((e) => e.name.toLowerCase() !== item.name.toLowerCase());
        setMychoices(updatedValueList);

        setSuggestions(prev=>[...prev, item]);
    };
    const handleKeyDown = e =>{
        const deleteIntent = e.target.value.trim() ==="" && e.key === "Backspace";
        if(deleteIntent && myChoices.length > 0){
            e.preventDefault();
            let lastItem = myChoices[myChoices.length -1];
            
            setTextInput(lastItem);
            removeItem(lastItem);
        }

        if ((e.key === 'Enter'||e.key.trim() === '') && textInput.name?.trim() !== '') {
            e.preventDefault();
            
            addItem(textInput);
            
            setTextInput({name:''});
        }
    }
  return(
    <div className="category input">
      {myChoices.map((item) => (
      <div key={item.name} className="category-item">
          {item.name}
          <i className="fa fa-times" aria-hidden="true" onClick={() => removeItem(item)}></i>
      </div>
      ))}
      <SearchDropdown 
        validateField={validateField}
        value={textInput} 
        name={suggestionTitle.toLowerCase()} 
        onChange={onChange} 
        itemSelected = {itemSelected}
        handleKeyDown={handleKeyDown}
        suggestions={suggestions} 
        placeholder={suggestionTitle}/>
  </div>
  )
}
export default AccounCreatetWorker