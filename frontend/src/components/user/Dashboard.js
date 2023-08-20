import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { accountTopupRequest, getWallet, verifyTopup } from '../../actions/userActions';
import { WALLET_TOPUP_LINK_RESET, WALLET_TOPUP_RESET } from '../../constants/userConstants';
import { useAlert } from 'react-alert';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ManageJobs from './dashboardLayout/ManageJobs';
import NearbyJobsLayout from './dashboardLayout/NearbyJobsLayout';
import { formatNumber } from '../SearchItem';
import { formatAmount } from '../Utils';

const Dashboard = () => {

    const dispatch = useDispatch();
    const alert = useAlert();
    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const handleOpen = () => setIsOpen(true);
    
    const { walletBalance, link, loading, topup, jobs } = useSelector(state => state.wallet);
    // Check currrent account balance
    useEffect(()=>{
        dispatch(getWallet())
        if(link){
            window.location.href = link;
            dispatch({type: WALLET_TOPUP_LINK_RESET});
        }

        if(topup){
            alert.success(topup.message);
            history.push('/dashboard');
            dispatch({type: WALLET_TOPUP_RESET});
        }
    }, [link, dispatch, alert, topup, history])

    useEffect(()=>{
        const urlParams = new URLSearchParams(window.location.search);
        const tx_ref = urlParams.get('tx_ref');
        const status = urlParams.get('status');
        const transaction_id = urlParams.get('transaction_id');

        if(status){
            dispatch(verifyTopup(`?status=${status}&tx_ref=${tx_ref}&transaction_id=${transaction_id}`));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    // Check if there was a successfull topup

    const fundWallet = (amount)=>{
        const formData = new FormData();
        formData.set('amount', amount);
        dispatch(accountTopupRequest(formData));
    }

    const userMode = JSON.parse(localStorage.getItem('userMode'));

    const formatNumber = value => Number(value).toLocaleString("en-US", {minimumFractionDigits: 2});
    
    return (
        <>
            <div className='funds'>
                <h5>Work credit balance</h5>
                <h2 className={`${loading&&'loading'}`}>{isNaN(walletBalance)?'--':`₦${formatNumber(walletBalance)}`}</h2>
                <div className="account-actions">
                    <div className="action" onClick={handleOpen}>
                        <button className='btn'>
                            <i className="fa fa-arrow-circle-down" aria-hidden="true"></i>
                        </button>
                        Top up
                    </div>
                    <div className="action">
                        <button className='btn'>
                            <i className="fa fa-credit-card" aria-hidden="true"></i>
                        </button>
                        Cashout
                    </div>
                    <div className="action" onClick={()=>history.push('/payments')}>
                        <button className='btn'>
                            <i className="fa fa-history" aria-hidden="true"></i>
                        </button>
                        History
                    </div>
                </div>
            </div>
            {jobs&& <div className="performance">
                <h5 className='text-secondary'>Past 7 days performance</h5>
                <div className="shoutout">
                    <h2 className="title">45 Job Request</h2>
                    <h2 className='text-success ms-3'>+13%</h2>
                </div>
                <div className="metrics">
                    <div className="legend">
                        36
                        <div className="legend-title">
                            <i className="fa fa-check-circle me-1 text-success" aria-hidden="true"></i>
                            completed
                        </div>
                    </div>
                    <div className="legend">
                        1
                        <div className="legend-title">
                            <i className="fa fa-tasks me-1 text-info" aria-hidden="true"></i>
                            In progress
                        </div>
                    </div>
                    <div className="legend">
                        5
                        <div className="legend-title">
                            <i className="fa fa-clock-o me-1 text-warning" aria-hidden="true"></i>
                            Pending
                        </div>
                    </div>
                </div>
            </div>}
            <ManageJobs />
            {!userMode&& <NearbyJobsLayout />}
            {isOpen&&<TopupModal handleClose={handleClose} handleAction={fundWallet} loading={loading}/>}
            {/* <RateWorker /> */}
        </>
    )
}

export const TopupModal = ({handleClose, handleAction, loading})=>{
    const [amount, setAmount] = useState('0');

    const onChange = (number) => setAmount(formatNumber(number))

    return(
        <div className="modal--overlay">
            <div className="modal-">
                <div className="modal--header">
                    <h2>Top up wallet</h2>
                    <button className="close-modal-" onClick={handleClose}>&times;</button>
                </div>
                <div className="modal--body">
                    <form>
                        <div className="mb-3">
                            <input 
                                type="text" 
                                className="input" 
                                id="amount" 
                                value={amount}
                                required
                                autoComplete='off'
                                onChange={e => onChange(e.target.value)}
                                placeholder="Enter amount"
                            />
                            <div for="email" className="suggession">
                                {[200,500,1000,5000].map(val =>
                                    <span onClick={e => onChange(val)}>
                                        {formatAmount(val)}
                                    </span>)}
                            </div>

                        </div>
                    </form>
                </div>
                <div className="modal--footer">
                    <button disabled={loading||parseInt(amount.replace(',','')) < 100} className={`btn bg-secondary-3 ${loading?'loading':''}`} onClick={()=>handleAction(amount)}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard