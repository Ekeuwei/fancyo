import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { walletTransactions } from '../../../actions/userActions';
import dateFormat from 'dateformat'

const PaymentHistory = () => {

    const dispatch = useDispatch();

    const { loading, transactions} = useSelector(state => state.wallet);

    const handleFilter = date => {
        dispatch(walletTransactions(date));
        handleClose();
    }

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);

    useEffect(()=>{
        dispatch(walletTransactions())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // loading?<Loader/>:
        (<div className={`nearby-tasks ${loading&& 'loading'}`}>
            <div className="heading-link">
                <div className="title">
                    <h5>Wallet Transactions</h5>
                </div>
                <div className="link" onClick={handleOpen}>
                    <h5>
                        <i className="fa fa-filter me-1" aria-hidden="true"></i>
                        Filter
                    </h5>
                </div>
            </div>
            {transactions?
                (transactions.map(transaction => (
                    <div className={`payment-item`} key={transaction._id}>
                        <ul>
                            <li>
                                <p>Status:</p>
                                <h6><span className={`status ${transaction.status}`}>{transaction.status}</span></h6>
                            </li>
                            <li>
                                <p>Transaction Type:</p>
                                <h6>{transaction.type.toUpperCase()}</h6>
                            </li>
                            <li>
                                <p>Amount:</p>
                                <h6>{transaction.amount}</h6>
                            </li>
                            <li>
                                <p>Date:</p>
                                <h6>{dateFormat(transaction.createdAt, "d mmmm yyyy, h:MM:ss TT")}</h6>
                            </li>
                        </ul>
                    </div>
                ))):
                (<div className={`empty-task-list ${loading&& 'loading'}`}>
                    <h5>{`No Transactions`}</h5>
                </div>)
            }
            {isOpen&& <FilterModal handleFilter={handleFilter} loading={loading} handleClose={handleClose}/>}
        </div>)
    )
}

const FilterModal = ({handleFilter, loading, handleClose})=>{

    const [dates, setDates] = useState({
        from: '',
        to: '',
    });
    const onChange = e => setDates(prev => ({...prev, [e.target.name]:e.target.value}))

  return (
    <div className="modal--overlay">
        <div className="modal-">
            <div className="filter">

                <div className="mb-3">
                    <h5>From</h5>
                    <div className="mb-2">
                        <div className="input">
                            <input 
                                aria-label="date lga" 
                                name="from"
                                type='date'
                                value={dates.from}
                                onChange={onChange}>
                            </input>
                        </div>
                    </div>
                    <h5>To</h5>
                    <div className="mb-2">
                        <div className="input">
                            <input 
                                aria-label="to date" 
                                name="to"
                                type='date'
                                value={dates.to}
                                onChange={onChange}>
                            </input>
                        </div>
                    </div>
                </div>
                <div className="d-flex">
                    <button className="btn me-1 bg-dark-3" onClick={handleClose}>Cancel</button>
                    <button className={`btn bg-primary-1 ${loading?'loading':''}`} onClick={()=> handleFilter()}>Apply filter</button>
                </div>
            </div>
        </div>
    </div>
  );

}


export default PaymentHistory