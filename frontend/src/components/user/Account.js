import React, { Fragment } from 'react'

const Account = () => {
  return (
    <Fragment>
        <div className="account-breadcrumbs">
            <img className="rounded-circle me-2" src="/images/avatar.png" style={{height: "3em"}} alt="" />
            <div className="breadcrumbs-title">
                <span><strong>Alfred Ekeuwei</strong> / <strong>Edit Profile</strong></span>
                <p className='mb-0'>Setup your presence and hiring needs</p>
            </div>
        </div>
        <form className='mx-3' action="">
            <div className="mb-3">
                <label for="name" className="form-label">Name *</label>
                <input 
                    type="name" 
                    name="name" 
                    className="form-control" 
                    id="name"
                    value={'Alfred Ekeuwei'}
                    // onChange={onChange}
                />
            </div>
            <div className="mb-3">
                <label for="address" className="form-label">Address *</label>
                <input 
                    type="address" 
                    name="address" 
                    className="form-control" 
                    id="address"
                    value={'Yenagoa, Bayelsa'}
                    // onChange={onChange}
                />
            </div>
            <div className="mb-3">
                <label for="bio" className="form-label">Bio</label>
                <textarea 
                    type="text" 
                    name="bio" 
                    className="form-control" 
                    id="bio"
                    // value={'Alfred Ekeuwei'}
                    // onChange={onChange}
                />
                <label for="bio" className="form-label text-secondary">Brief description of your profile</label>
            </div>
            <div className="mb-3 text-center">
                {/* <Link to="/login" className="btn btn-link text-dark-1" >Login</Link> */}
                <button type="submit" className={`btn bg-primary-1 px-3`}>Save</button>
            </div>
        </form>
    </Fragment>
  )
}

export default Account