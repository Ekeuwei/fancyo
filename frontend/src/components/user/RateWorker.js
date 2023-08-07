import React, { useState } from 'react'
import StarRating from './StarRating'

const RateWorker = ({handleCancel, handleUpdate, workerId, loading, taskId, taskWorker}) => {

    const [rating, setRating] = useState(taskWorker?.review?.rating || 0);
    const [comment, setComment] = useState(taskWorker?.review?.comment || '')
    const [shakeFields, setShakeFields] = useState([])

    const subm = (e)=>{
        e.preventDefault();
        
        if(rating === 0 ){
            setShakeFields(prev=> [...prev, 'rating'])
            // Please rate the user's performance
        }else if(rating < 3 && comment===''){
            setShakeFields(prev=>[...prev, 'comment'])
            // Tell us more about your experience with this user
        }else{
            // Submit data
            handleUpdate({ rating, comment, workerId, taskId })
        }
        
        setTimeout(()=> setShakeFields([]), 500)
    }

    return (
        <div className="modal--overlay">
            <div className="modal-">
                <div className="review">
                    <div className="review-heading">
                        <h3>{}</h3>
                        <i class="fa fa-times" aria-hidden="true" onClick={handleCancel}></i>
                    </div>
                    <div className="user-view">
                        <div className="avatar">
                            <img src={taskWorker.worker.owner.avatar.url} alt="Avatar" />
                        </div>
                        <h4>{`${taskWorker.worker.owner.firstName} ${taskWorker.worker.owner.lastName}`} </h4>
                        {/* <div className="rating-outer">
                            <div className="rating-inner" style={{width: `${(2 / 5) * 100}%`}}></div>
                        </div> */}
                        <div className={`${shakeFields.includes('rating')?'shake':''}`}>
                            <StarRating rating={rating} setRating={setRating}/>
                        </div>
                    </div>
                    <div className={`mb-3 ${shakeFields.includes('comment')?'shake':''}`}>
                        <label for="message" className="form-label">
                            Comment:
                        </label>
                        <div className="input">
                            <textarea
                            value={comment}
                            onChange={e=>setComment(e.target.value)}
                            rows="3"
                        />
                        </div>
                    </div>
                    <button className={`btn bg-primary-1 ${loading?'loading':''}`} onClick={subm}>Submit</button>
                </div>
            </div>
        </div>
    )
}

export default RateWorker