import styled from 'styled-components'
import ModalContainter from '../modals/ModalContainter'
import PropTypes from 'prop-types'
import { Button, Input, InputLabel, InputWrapper, Loading, NoticeMessage, Select, Shake } from '../../../theme/ThemeStyle'
import { useEffect, useState } from 'react'
import NavHeader from '../layout/NavHeader'
import Ticket from './Ticket'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../../../common/api'
import { createToast } from '../../../app/user/userSlice'
import { clearLoadedTicket } from '../../../app/project/projectSlice'
import { clearTicketErrors } from '../../../app/ticket/ticketSlice'
import { formatNumber } from '../../../common/utils'

const NewTicket = ({isOpen, handleModalClose, projectId}) => {
    const [data, setData] = useState({
        ticketId: '',
        bookie: '',
        stakeAmount: ''
    })

    const [emptyFields, setEmptyFields] = useState([])
    const { projectDetails } = useSelector(state => state.project)

    const dispatch = useDispatch()
    const { ticket, loading:loadingTicket, error } = useSelector(state => state.project)
    const { loading, error:submitError, message } = useSelector(state => state.ticket)

    const onChange = (e)=> setData(prevData => {
        if(e.target.name==='stakeAmount'){
            e.target.value = e.target.value==0?'':formatNumber(e.target.value)
        }
        return ({...prevData, [e.target.name]:e.target.value})
    })
    
    const options = [
        {
            name: "Sporty Bet",
            value: "Sporty"
        },
        {
            name: "Bet9ja",
            value: ""
        },
        {
            name: "Merrybet",
            value: ""
        },
    ]

    const loadTicket = ()=> {
        
        const newEmptyFields = Object.keys(data).filter(key=>data[key]===''&& key !=='stakeAmount')
        setEmptyFields(newEmptyFields)

        if(newEmptyFields.length===0){
            dispatch(api.loadTicket(data))
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        const newEmptyFields = Object.keys(data).filter(key=>data[key]==='')
        setEmptyFields(newEmptyFields)

        if(newEmptyFields.length === 0){
            dispatch(api.createTicket({...data, projectId}, projectDetails))
            dispatch(clearLoadedTicket())
        }
    }

    useEffect(() => {
        if (emptyFields.length > 0) {
            const timeoutId = setTimeout(() => {
                setEmptyFields([]);
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [emptyFields]);

    useEffect(()=>{
        if(message){

            dispatch(createToast({message, type:'success'}))
            setData(prevData => Object.keys(prevData).reduce((acc, key) => (acc[key] = '', acc), {}));
            
            dispatch(clearTicketErrors())

            handleModalClose()

            // Toast message on screen
        }else{
            loadTicket()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[data.bookie, dispatch, message])

    
    return (
        <ModalContainter isOpen={isOpen} handleModalClose={handleModalClose} >
            <>
                <NavHeader title={"Create Ticket"} handleModalClose={handleModalClose}/>
                <FormControl onSubmit={handleSubmit}>
                    <Shake value={emptyFields.includes('ticketId')?'animate':''}>
                        <InputWrapper>
                            <InputLabel value={data.ticketId}>Ticket Id</InputLabel>
                            <Input 
                                value={data.ticketId}
                                label={data.ticketId}
                                name='ticketId'
                                autoComplete='off'
                                placeholder='Ticket Id'
                                onChange={onChange} />
                            <SendButton type='button' disabled={loadingTicket} onClick={loadTicket}> Check <Loading value={loadingTicket?'':null} /></SendButton>
                        </InputWrapper>
                    </Shake>
                    <Shake value={emptyFields.includes('bookie')?'animate':''}>
                        <InputWrapper>
                            <InputLabel value={data.bookie}>Bookie</InputLabel>
            
                            <Select 
                                id="mySelect" 
                                value={data.bookie} 
                                onChange={onChange} 
                                name="bookie"
                                label={data.bookie} >
                                
                                <option value="">Select bookie</option>
                                {options.map((option, index)=>(
                                    <option key={index} value={option.value}>
                                        {option.name}
                                    </option>
                                ))}
                            </Select>
                        </InputWrapper>
                    </Shake>

                    <Shake value={emptyFields.includes('stakeAmount')?'animate':''}>
                        <InputWrapper>
                            <InputLabel value={data.stakeAmount}>Stake Amount</InputLabel>
                            <Input 
                                value={data.stakeAmount}
                                label={data.stakeAmount}
                                name='stakeAmount'
                                autoComplete='off'
                                placeholder='Stake Amount'
                                onChange={onChange} />
                        </InputWrapper>
                    </Shake>
                    {ticket&&<Ticket value={"collapsing"} stakeAmount = {data.stakeAmount} picks={ticket.games}/>}
                    
                    <NoticeMessage value={error||submitError?'error':''} >{error||submitError||message}</NoticeMessage>
                    
                    <Button type='submit' disabled={loading} ><Loading value={loading?'':null} />Submit Ticket</Button>
                </FormControl>
            </>

        </ModalContainter>
    )
}

NewTicket.propTypes = {
    isOpen: PropTypes.string,
    projectId: PropTypes.string,
    handleModalClose: PropTypes.func
}

const FormControl = styled.form`
    padding: 0 10px 10px;
`

const SendButton = styled(Button)`
    position: absolute;
    right: 2px;
    bottom: 50%;
    z-index: 1;
    padding: 0 12px;
    border-radius: 7px;
    transform: translateY(50%);
    height: calc(100% - 4px);
    width: fit-content;
`

export default NewTicket