import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData';

import { createWorker as create, clearErrors} from '../../actions/workerActions';
import { CREATE_WORKER_RESET } from '../../constants/workerConstants';

const CreateWorker = ({ history }) => {
    const alert = useAlert();
    const dispatch = useDispatch()

    const [worker, setWorker] = useState({
        bio:'', 
        billingFormat:'',
        billingAmount: 0,
        serviceTags:[], 
        category:'',
    })

    const { error, loading, workerCreated } = useSelector(state => state.worker);
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');


    useEffect(() => {

        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(workerCreated){
            alert.success("REQUEST SUBMITTED")
            dispatch({type: CREATE_WORKER_RESET})
            history.push('/')
        }

    }, [dispatch, alert, error, workerCreated, history])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.set("avatar", avatar)
        formData.set("bio", worker.bio)
        formData.set("billingFormat", worker.billingFormat)
        formData.set("billingAmount", worker.billingAmount)
        formData.set("serviceTags", worker.serviceTags)
        formData.set("category", worker.category)

        dispatch(create(formData))
    }

    const categories = ["Make-up Artist", "Carpenter", "Electrician", "MC", "House Keeper", "Nanny"]
    const billingFormats = ["Hourly", "Daily", "Contract"]

    const onChange = e => {
        if(e.target.name === 'avatar'){
            const reader = new FileReader();

            reader.onload = () => {
                if(reader.readyState === 2){
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])
        } else {
            setWorker((prevValues)=>({ ...prevValues, [e.target.name]: e.target.value }))
        }
    }
    return (
        <Fragment>
                <MetaData title={'Create Worker Profile'} />

                <section className='center-screen tile'>
                    <div className="auth">
                        <form onSubmit={ submitHandler} encType='multipart/form-data'>
                            <div class="position-relative">
                                <div class="avatar-preview">
                                <img 
                                    class="rounded-circle w-100 mx-auto" 
                                    src={ avatarPreview } alt="Avatar Preview"
                                />
                                </div>
                            </div>
                            <h3 class="py-4 text-start">Create Worker Profile</h3>
                            <div class="progress mb-3 rounded-pill">
                                <div class="progress-bar bg-primary-2 rounded-pill" role="progressbar" style={{width: "33%"}} aria-valuenow="33" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                            <div class="mb-3">
                                <input 
                                    name="avatar"
                                    type="file" 
                                    class="form-control" 
                                    src={avatar}
                                    id="avatar"
                                    onChange={onChange}
                                />
                            </div>
                            <div class="mb-3">
                                <label for="state" class="form-label">Category</label>
                                <select 
                                    class="form-select" 
                                    aria-label="Select State" 
                                    required
                                    name="category"
                                    value={worker.state}
                                    onChange={onChange} >
                                    <option selected>select</option>
                                    {categories.map(category => <option value={category}>{category}</option>)}
                                </select>
                            </div>
                            <div class="mb-3">
                                <span>
                                    <label for="lastName" class="form-label">Amount</label>
                                    <input 
                                        name="billingAmount"
                                        type="billingAmount" 
                                        required
                                        class="form-control" 
                                        id="amount" 
                                        placeholder="amount"
                                        value={worker.billingAmount}
                                        onChange={onChange}
                                    />
                                </span>
                                <span>
                                    <label for="lastName" class="form-label">Format</label>
                                    <select 
                                        class="form-select" 
                                        aria-label="Select Option" 
                                        required
                                        name="billingFormat"
                                        value={worker.billingFormat}
                                        onChange={onChange} >
                                        <option selected>select</option>
                                        {billingFormats.map(format => <option value={format}>{format}</option>)}
                                    </select>
                                </span>
                            </div>
                            <div class="mb-3 text-end">
                                <button type="submit" class="btn bg-primary-1 px-3">Send</button>
                            </div>
                        </form>
                    </div>
                </section>

            </Fragment>
    )
}

export default CreateWorker