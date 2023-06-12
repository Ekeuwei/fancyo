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
  const { user } = useSelector(state => state.auth);
  const { towns } = useSelector(state => state.prefs);

  const [images, setImages] = useState({
    avatar: user?.avatar?.url || `${window.location.origin}/images/default_avatar.jpg`,
    featured: ''
  });

  const [worker, setWorker] = useState({
        category: '',
        minRate: '',
        dailyRate: '',
        description: '',
    })

    const onChange = e => {
      if('avatar, featured'.includes(e.target.name)){
        const reader = new FileReader();

        reader.onload = () => {
            if(reader.readyState === 2){
              setImages(prevData => ({...prevData, [e.target.name]: reader.result}));
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
      const category = categories.filter(el => el.key === worker.category);

        const formData = new FormData();

        formData.set("featuredGraphics", images.featured)
        formData.set("category", JSON.stringify(category[0]))
        formData.set("minRate", worker.minRate)
        formData.set("dailyRate", worker.dailyRate)
        formData.set("localities", JSON.stringify(localities))
        formData.set("description", worker.description)

        dispatch(createWorker(formData))
    }

    const categories = [
        {key: 'makeup', name:"Make-up Artist"}, 
        {key: "carpenter", name: "Carpenter"}, 
        {key: "electrician", name: "Electrician"}, 
        {key: "mc", name: "MC (Master of Ceremony)"}, 
        {key: "housekeep", name: "House Keeper"},
        {key: "nanny", name: "Nanny"}
    ];

    useEffect(()=>setHasFG(images.featured), [images.featured]);
    
    useEffect(()=>dispatch(getTowns("647744b487968b971280e108")), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]);


    const [ suggestions, setSuggestions ] = useState(towns)
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
            <input className='d-none' type='file' ref={featureInputRef} name="featured" onChange={onChange}/>
            <button className='btn btn-secondary mx-4' onClick={()=> featureInputRef.current.click()}>
              <i className="fa fa-plus me-1" aria-hidden="true"></i>
              Add Display Picture</button>
          </div>
          <img 
              src={images.featured} 
              className={`${!hasFG && 'd-none'}`}
              alt="featured Graphics"
            />
          <div className={`clear-btn ${!hasFG && 'd-none'}`} onClick={()=>setImages(prevData=>({...prevData, featured:''}))}>
            <i className="fa fa-minus-circle p-2" aria-hidden="true"></i>
          </div>
        </div>
        <div className="featured-graphics-avatar">
            <input className='d-none' name='avatar' ref={avatarInputRef} type="file" onChange={onChange} />
            <img 
                src={images.avatar}
                name="avatar"
                onChange={onChange}
                alt=""
              />
            <i className="fa fa-pencil-square-o edit-icon" onClick={()=>avatarInputRef.current.click()} aria-hidden="true"></i>
        </div>

        <div className="mx-3 mt-4">
          <div className="mb-3">
            <label for="category" className="form-label">Category / Service Type </label>
            <select 
              className="form-select" 
              aria-label="Select category" 
              required
              name="category"
              value={worker.category}
              onChange={onChange} >
              <option selected>select</option>
              {categories.map(category => <option key={category.key} value={category.key}>{category.name}</option>)}
          </select>
          </div>

          <div className="mb-3">
            <label for="minRate" className="form-label">Minimum charge for job?</label>
            <input 
                name="minRate"
                type="text" 
                required
                className="input" 
                id="minRate" 
                value={worker.minRate}
                onChange={onChange}
            />
          </div>
          <div className='mb-3'>
              <label for="dailyRate" className="form-label">Your daily rate?</label>
              <input 
                  name="dailyRate"
                  type="text" 
                  required
                  className="input" 
                  id="dailyRate" 
                  value={worker.dailyRate}
                  onChange={onChange}
              />
          </div>

          <MultipleInput 
            suggestions={suggestions} 
            setSuggestions={setSuggestions}
            myChoices={localities}
            setMychoices={setLocalities}
            suggestionTitle="Localities" />

          <div className="mb-3">
            <label for="description" className="form-label">Description</label>
            <textarea 
                type="text" 
                name="description" 
                className="input" 
                id="description"
                value={worker.description}
                onChange={onChange}
            />
            <label for="description" className="form-label text-secondary">Describe the servies you perform</label>
          </div>
        </div>
        <div className="mb-3 text-center">
            <button disabled={loading} type="submit" className={`btn bg-primary-1 px-3`}>Create Account</button>
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