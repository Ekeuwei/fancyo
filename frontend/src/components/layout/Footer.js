import React, { Fragment } from 'react'

const Footer = () => {
    return (
        <Fragment>
            <footer className="py-1 mt-auto">
                <div className="container-fluid text-center mx-auto">
                    <hr/>
                    <h3>Ebiwoni</h3>
                    <p>© ebiwoni Limited 2023</p>
                    <span>
                        <i className="p-2 fa fa-facebook" aria-hidden="true"></i>
                        <i className="p-2 fa fa-linkedin" aria-hidden="true"></i>
                        <i className="p-2 fa fa-twitter" aria-hidden="true"></i>
                        <i className="p-2 fa fa-instagram" aria-hidden="true"></i>
                    </span>
                </div>
            </footer>
        </Fragment>
    )
}

export default Footer
