import React, { Fragment } from 'react'
import { Route, Redirect } from 'react-router-dom'

const ProtectedRoute = ({isAdmin, component: Component, ...rest}) => {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <Fragment>
            <Route 
                {...rest}
                render = {props => {
                    if(!user?.role){
                        return <Redirect to='/login' />
                    }

                    if(isAdmin === true && user.role !=='admin'){
                        return <Redirect to='/' />
                    }

                    return <Component {...props} />
                }}
                />
        </Fragment>
    )
}

export default ProtectedRoute
