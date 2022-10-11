import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { clearErrors, getOrderDetails, updateOrder } from '../../actions/orderActions'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'
import loader from '../layout/Loader'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'

const ProcessOrder = ({ match, history }) => {

    const [status, setStatus] = useState('')
    
    const alert = useAlert()
    const dispatch = useDispatch()

    const { loading, order } = useSelector(state => state.orderDetails)
    const { shippingInfo, orderItems, paymentInfo, user, totalPrice, orderStatus } = order
    const { error, isUpdated } = useSelector(state => state.order)

    const orderId = match.params.id

    useEffect(()=>{

        dispatch(getOrderDetails(orderId))
        
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }

        if(isUpdated){
            alert.success('Order updated successfully')
            dispatch({ type: UPDATE_ORDER_RESET})
        }

    }, [dispatch, alert, error, isUpdated, history, orderId])

    const updateOrderHandler = (id) => {

        const formData = new FormData();
        formData.set('status', status)

        dispatch(updateOrder(id, formData))
    }

    const shippingDetails = shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`
    const isPaid = paymentInfo && paymentInfo.status === 'succeeded'

    return (
        <Fragment>
            <MetaData title={`Processs Orders # ${order && order._id}`} />
            <div className="row">
                <div className="col-l2 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        {loading? <loader /> : (
                            <div className="row d-flex justify-content-around">
                                <div className="col-12 col-lg-7 order-details">

                                    <h1 className="my-5">Order # {order._id}</h1>

                                    <h4 className="mb-4">Shipping Info</h4>
                                    <p><b>Name:</b> {user && user.name}</p>
                                    <p><b>Phone:</b> {shippingInfo && shippingInfo.phoneNo}</p>
                                    <p className="mb-4"><b>Address:</b>{shippingDetails}</p>
                                    <p><b>Amount:</b> ${totalPrice}</p>

                                    <hr />

                                    <h4 className="my-4">Payment</h4>
                                    <p className={isPaid? "greenColor": "redColor"} >
                                        <b>{isPaid? "PAID": "NOT PAID"}</b>
                                    </p>

                                    <h4 className="my-4">Stripe ID</h4>
                                    <p className="greenColor" > <b>{paymentInfo && paymentInfo.id}</b> </p>

                                    <h4 className="my-4">Order Status:</h4>
                                    <p className={orderStatus && String(orderStatus).includes('Delivered')
                                        ?"greenColor":"redColor"} ><b>{orderStatus}</b></p>

                                    <h4 className="my-4">Order Status:</h4>
                                    <p className='greenColor' ><b>{orderStatus}</b></p>


                                    <h4 className="my-4">Order Items: {orderItems && orderItems.length}</h4>

                                    <hr />
                                    <div className="cart-item my-1">
                                        {order.orderItems && order.orderItems.map(item => (
                                        <div className="row my-5" key={item.product}>
                                                <div className="col-4 col-lg-2">
                                                    <img src={item.image} alt={item.name} height="45" width="65" />
                                                </div>

                                                <div className="col-5 col-lg-5">
                                                    <Link to={`/products/${item.product}`}>{item.name}</Link>
                                                </div>


                                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                    <p>${item.price}</p>
                                                </div>

                                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                    <p>{item.quantity} Piece(s)</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                </div>
                                
                                <div className="col-12 col-lg-3 mt-5">
                                    <h4 className="my-4">Status</h4>

                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name='status'
                                            value={status}
                                            onChange={(e)=> setStatus(e.target.value)}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </div>

                                    <button className="btn btn-primary btn-block" onClick={()=>updateOrderHandler(order._id)}>
                                        Update Status
                                    </button>
                                </div>
                                
                            </div>
        
                        )}
                        
                    </Fragment>
                </div>
            </div>
            
        </Fragment>
    )
}

export default ProcessOrder
