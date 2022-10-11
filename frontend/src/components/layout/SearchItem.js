import { Fragment } from "react"

const SearchItem = (user)=>{
    return(
        <Fragment>
            <div className="col-6 col-sm-4 col-md-3 col-lg-5 mb-3 text-center mx-sm-0 mx-auto" style={{"max-width": "16rem", "min-width": "11rem"}}>
                <div className="card mx-auto border-0 bg-secondary-2">
                    <h5 className="card-title py-2 bg-primary-1 text-white">Electrician</h5>
                    <img className="rounded-circle w-50 h-auto mx-auto" src="./images/avatar.png" alt=""/>
                    <span>
                        <p className="m-0">
                            <strong>Wade Warren</strong>
                            <i className="fa fa-check-circle text-success" aria-hidden="true"></i>
                        </p>
                        <span className="text-primary-1 m-0">
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                            <i className="fa fa-star" aria-hidden="true"></i>
                        </span>
                        <p>N500/hr</p>
                    </span>
                    <div className="text-start ps-2">
                        <p className="mb-1">Status: Active
                            <i className="text-secondary-3 fa fa-circle" aria-hidden="true"></i>
                        </p>
                        <p className="mb-1">Location: Sagbama</p>
                        <p>Experience: 20yrs+</p>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}