import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNearbyTasks } from '../../../actions/taskAction';
import NearbyTaskItemView from './NearbyTaskItemView';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const NearbyJobsLayout = () => {

    const dispatch = useDispatch();

    const history = useHistory();

    const { nearbyTasks } = useSelector(state => state.myTasks);
    // const { user } = useSelector(state => state.auth)
    const user = JSON.parse(localStorage.getItem('user'))

    useEffect(()=>{
        if(user.contact !== undefined){
            dispatch(getNearbyTasks({
                location:{
                    lga: user?.contact?.town?.lga?._id
                }
            }))
        }
    }, [])

    return (
        <>
            {nearbyTasks?.length>0&& <div className="nearby-tasks">
                <div className="heading-link">
                    <div className="title">
                        <h5>Job Requests Near You</h5>
                    </div>
                    {nearbyTasks?.length > 0 && 
                        (<div className="link" onClick={()=>history.push('/morejobs')}>
                            <h5>See All</h5>
                        </div>)}
                </div>
                <div className="grid--">
                    {nearbyTasks.map(task => (
                        <NearbyTaskItemView key={task._id} task={task}/>
                    ))}
                </div>
            </div>}
        </>
    )
}

export default NearbyJobsLayout