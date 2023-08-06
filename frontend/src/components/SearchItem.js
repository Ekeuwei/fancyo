export const formatNumber = value => new Intl.NumberFormat('en-US').format(value.toString().replace(/\D/g, ''))//Number(value).toLocaleString("en-US");
export const formatNumberFraction = value => Number(value).toLocaleString("en-US", {minimumFractionDigits: 2});

const SearchItem = ({worker, viewArtisan})=> {
  return(
    <div
      className="col-6 col-sm-4 col-md-3 col-lg-5 mb-3 text-center"
      style={{ maxWidth: "16rem", minWidth: "11rem" }}
    >
      <div
        onClick={()=>viewArtisan(worker._id)}
        className="card mx-auto border-0 bg-secondary-2 text-dark"
      >
        <h5 className="card-title py-2 bg-primary-1 text-uppercase text-white single-line">
          {worker.category.name}
        </h5>
        <div className="w-50  mx-auto">
          <div className="avatar">
            <img
              src={worker.owner.avatar.url}
              alt={`${worker.owner.firstName}`}
            />
          </div>
        </div>
        <span>
          <p className="m-0">
            <strong className="me-2">{`${worker.owner.firstName} ${worker.owner.lastName}`}</strong>
            <i
              className="fa fa-check-circle text-success"
              aria-hidden="true"
            ></i>
          </p>
          <span className="text-primary-1 m-0">
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
            <i className="fa fa-star" aria-hidden="true"></i>
          </span>
          <p>{`₦${formatNumber(worker.pricing.minRate)} / Job`}</p>
        </span>
        <div className="text-start ps-2">
          <p className="mb-1">
            {`Status: ${worker.availability}`}
            <span className="position-relative ms-1">
              <i
                className="position-absolute top-50 start-50 translate-middle text-secondary-3 fa fa-circle ms-1"
                style={{ fontSize: "10px" }}
                aria-hidden="true"
              ></i>
            </span>
          </p>
          <p className="mb-1">{`Location: ${worker.owner.contact?.town?.name}`}</p>
        </div>
      </div>
    </div>
  )
}

export default SearchItem;