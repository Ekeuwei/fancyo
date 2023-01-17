import { Fragment, useState } from "react"

const EngageUser = ()=>{
    const [jobOrder, setJobOrder] = useState({
        workOrder: '',
        taskLocation: '',
        duration: '',
        waitTime: ''
    });

    
    const {workOrder,taskLocation,duration,waitTime} = jobOrder;

    const onChange = (e) => setJobOrder({ ...jobOrder, [e.target.name]: e.target.value})
    return (
        <Fragment>            
            <div class="mb-3">
                <label for="workOder" class="form-label">What I’m I doing for you?</label>
                <textarea 
                    class="form-control" 
                    id="workOder" 
                    name="workOrder"
                    value={workOrder} 
                    onChange={onChange}
                    rows="3" />
                <ul class="card-text d-flex flex-wrap list-unstyled text-center">
                    <li class="col mt-1 me-1 px-2 text-nowrap" style={{"max-width": "fit-content"}}>Suggestion:</li>
                    <li class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap" style={{"max-width": "fit-content"}}>Dispatch Job</li>
                    <li class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap" style={{"max-width": "fit-content"}}>Errands Job</li>
                    <li class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap" style={{"max-width": "fit-content"}}>Delivery Job</li>
                    <li class="badge border rounded-pill col mt-1 me-1 text-muted text-nowrap" style={{"max-width": "fit-content"}}>Pick-up Job</li>
                </ul>
                </div>
                <div class="mb-3">
                    <label for="taskLocation" class="form-label">Where I’m I performing the job?</label>
                    <input type="text" class="form-control" id="taskLocation" name={taskLocation} onChange={onChange} placeholder="Amarata"/>
                </div>
                <div class="mb-3">
                    <label class="d-block form-label">How long do you want to engage me?</label>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="engagePeriod" id="fullDay" value="Full Day"/>
                        <label class="form-check-label" for="fullDay">Full Day</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="engagePeriod" id="asLongAsPossible" value="As Long as possible"/>
                        <label class="form-check-label" for="asLongAsPossible">As Long as possible</label>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="d-block form-label">I'm currently completing a task! How long can you wait?</label>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="waitTime" id="30minutes" value="30 Minutes"/>
                        <label class="form-check-label" for="30minutes">30 Minutes</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="waitTime" id="whenDone" value="Till you're done"/>
                        <label class="form-check-label" for="whenDone">Till you're done</label>
                    </div>
                    {/* <p className="my-3">This worker is expected to arrive the job premises within 30 minutes from time of request. However, you can alter the timing to indicate the urgency of the job.</p> */}

                </div>
        </Fragment>
    )
}

export default EngageUser