import { Fragment } from "react"


const Task = ()=>{

    return(
        <Fragment>
            <div class="list-group m-2">

                <div class="d-flex list-group-item bg-primary-1 mb-1 align-items-center">
                    <h3 class="my-auto">Job Orders</h3>
                    <span class="ms-auto me-1"><i class="fa fa-sliders fa-lg" aria-hidden="true"></i></span>
                </div>

                <div class="row bg-secondary-4 mb-1 mx-0">
                    <div class="col-3 text-center my-auto">
                        <img class="w-100 p-2 rounded-circle" src={`${window.location.origin}/images/avatar.png`} alt="" />
                    </div>
                    <div class="col-6 py-2 gx-1 my-auto">
                        <h5 class="mb-0"><small>Rebecca Jolie</small></h5>
                        <p class="mb-0 lh-sm fw-light"><small>Assigned to perform electrical bulb installation</small></p>
                        <p class="mb-0 fw-light"><em><small>Pending</small></em>
                            <i class="fa fa-circle ps-1 text-dark-3" style={{"font-size": "10px"}} aria-hidden="true"></i></p>
                    </div>
                    <div class="col-3 text-center my-auto">
                        <button type="button" class="btn btn-sm p-sm-2 px-sm-3 bg-dark-3 rounded-3">Cancel</button>
                    </div>
                </div>

                <div class="row bg-secondary-4 mb-1 mx-0">
                    <div class="col-3 text-center my-auto">
                        <img class="w-100 p-2 rounded-circle" src={`${window.location.origin}/images/avatar.png`} alt="" />
                    </div>
                    <div class="col-6 py-2 gx-1 my-auto">
                        <h5 class="mb-0"><small>Rebecca Jolie</small></h5>
                        <p class="mb-0 lh-sm fw-light"><small>Assigned to perform electrical bulb installation</small></p>
                        <p class="mb-0 fw-light"><em><small>In Progress</small></em>
                            <i class="fa fa-circle ps-1 text-primary-1" style={{"font-size": "10px"}} aria-hidden="true"></i></p>
                    </div>
                    <div class="col-3 text-center my-auto">
                        <button type="button" class="btn btn-sm p-sm-2 px-sm-3 bg-primary-1 rounded-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Review</button>
                    </div>
                </div>

                <div class="row bg-secondary-4 mb-1 mx-0">
                    <div class="col-3 text-center my-auto">
                        <img class="w-100 p-2 rounded-circle" src={`${window.location.origin}/images/avatar.png`} alt="" />
                    </div>
                    <div class="col-6 py-2 gx-1 my-auto">
                        <h5 class="mb-0"><small>Rebecca Jolie</small></h5>
                        <p class="mb-0 lh-sm fw-light"><small>Assigned to pick up laundary</small></p>
                        <p class="mb-0 fw-light"><em><small>Completed</small></em>
                            <i class="fa fa-circle ps-1 text-success" style={{"font-size": "10px"}} aria-hidden="true"></i></p>
                    </div>
                    <div class="col-3 text-center my-auto">
                        <button type="button" class="btn btn-sm p-sm-2 px-sm-3 bg-primary-1 rounded-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Review</button>
                    </div>
                </div>

                <div class="row bg-secondary-4 mb-1 mx-0">
                    <div class="col-3 text-center my-auto">
                        <img class="w-100 p-2 rounded-circle" src={`${window.location.origin}/images/avatar.png`} alt="" />
                    </div>
                    <div class="col-6 py-2 gx-1 my-auto">
                        <h5 class="mb-0"><small>Rebecca Jolie</small></h5>
                        <p class="mb-0 lh-sm fw-light"><small>Assigned to perform electrical bulb installation</small></p>
                        <p class="mb-0 fw-light"><em><small>Canceled</small></em>
                            <i class="fa fa-circle ps-1 text-danger" style={{"font-size": "10px"}} aria-hidden="true"></i></p>
                    </div>
                    <div class="col-3 text-center my-auto">
                        <button type="button" class="btn btn-sm p-sm-2 px-sm-3 bg-primary-1 rounded-pill ">Report</button>
                    </div>
                </div>

                <div class="row bg-secondary-4 mb-1 mx-0">
                    <div class="col-3 text-center my-auto">
                        <img class="w-100 p-2 rounded-circle" src={`${window.location.origin}/images/avatar.png`} alt="" />
                    </div>
                    <div class="col-6 py-2 gx-1 my-auto">
                        <h5 class="mb-0"><small>Rebecca Jolie</small></h5>
                        <p class="mb-0 lh-sm fw-light"><small>Assigned to perform grocessary shopping</small></p>
                        <p class="mb-0 fw-light"><em><small>Completed</small></em>
                            <i class="fa fa-circle ps-1 text-success" style={{"font-size": "10px"}} aria-hidden="true"></i></p>
                    </div>
                    <div class="col-3 text-center my-auto">
                        <button type="button" class="btn btn-sm p-sm-2 px-sm-3 bg-primary-1 rounded-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Review</button>
                    </div>
                </div>

            </div>
        </Fragment>
    )
}

export default Task